-- GasGrid Phase 1 PostgreSQL + PostGIS schema (draft)
-- Use in migrations (prefer Flyway or PgMigrate)

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS audit;

-- Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE core.users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  keycloak_id uuid,
  username text UNIQUE NOT NULL,
  email text,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE core.roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text
);

CREATE TABLE core.permissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  description text
);

CREATE TABLE core.role_permissions (
  role_id uuid REFERENCES core.roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES core.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE core.stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  geom geometry(Point,4326) NOT NULL,
  address text,
  status text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX stations_gix ON core.stations USING GIST(geom);

CREATE TABLE core.pipelines (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  name text,
  type text,
  geom geometry(LineString,4326) NOT NULL,
  material text,
  diameter_mm numeric,
  installed_at date,
  status text,
  metadata jsonb
);
CREATE INDEX pipelines_gix ON core.pipelines USING GIST(geom);

CREATE TABLE core.assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  station_id uuid REFERENCES core.stations(id),
  pipeline_id uuid REFERENCES core.pipelines(id),
  asset_type text,
  serial_number text,
  metadata jsonb
);

CREATE TABLE core.sensors (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id uuid REFERENCES core.assets(id) NOT NULL,
  sensor_type text,
  mqtt_client_id text,
  mqtt_topic text,
  provisioning_cert_id text,
  status text
);

-- Telemetry as partitioned table by day
CREATE TABLE core.telemetry (
  id bigserial PRIMARY KEY,
  sensor_id uuid REFERENCES core.sensors(id) NOT NULL,
  ts timestamptz NOT NULL,
  payload jsonb,
  pressure_pa numeric,
  flow_m3s numeric,
  temperature_c numeric
);

-- Partitioning: create templates (migrations should create daily partitions)

CREATE TABLE core.work_orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  title text,
  description text,
  created_by uuid REFERENCES core.users(id),
  assigned_to uuid REFERENCES core.users(id),
  related_asset_id uuid REFERENCES core.assets(id),
  status text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE core.maintenance_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_order_id uuid REFERENCES core.work_orders(id),
  performed_by uuid REFERENCES core.users(id),
  performed_at timestamptz,
  notes text,
  attachments jsonb
);

CREATE TABLE audit.audit_log (
  id bigserial PRIMARY KEY,
  entity text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  changed_by uuid,
  changed_at timestamptz DEFAULT now(),
  delta jsonb
);

-- Basic indexes
CREATE INDEX idx_telemetry_ts ON core.telemetry(ts);
CREATE INDEX idx_telemetry_sensor_ts ON core.telemetry(sensor_id, ts DESC);

-- Triggers for audit logging (example for stations)
CREATE OR REPLACE FUNCTION audit_core_stations() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit.audit_log(entity, entity_id, action, changed_by, delta)
    VALUES('stations', NEW.id, 'insert', NULL, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit.audit_log(entity, entity_id, action, changed_by, delta)
    VALUES('stations', NEW.id, 'update', NULL, json_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit.audit_log(entity, entity_id, action, changed_by, delta)
    VALUES('stations', OLD.id, 'delete', NULL, row_to_json(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_stations AFTER INSERT OR UPDATE OR DELETE ON core.stations
  FOR EACH ROW EXECUTE PROCEDURE audit_core_stations();

-- Additional triggers will be added for other core tables in migrations.
