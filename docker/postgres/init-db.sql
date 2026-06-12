-- Enable PostGIS spatial extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keycloak_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(100) NOT NULL,
    target_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Stations Table (GIS Point)
CREATE TABLE IF NOT EXISTS stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CITY_GATE', 'CUSTOMER', 'REGULATOR')),
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
    capacity_m3_h DOUBLE PRECISION NOT NULL,
    pressure_rating_bar DOUBLE PRECISION NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Spatial index on station locations
CREATE INDEX IF NOT EXISTS idx_stations_location ON stations USING GIST(location);

-- 4. Pipelines Table (GIS LineString)
CREATE TABLE IF NOT EXISTS pipelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('TRUNK', 'SPUR')),
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'DECOMMISSIONED')),
    nominal_diameter_inch DOUBLE PRECISION NOT NULL,
    material VARCHAR(100) NOT NULL CHECK (material IN ('STEEL', 'HDPE')),
    pressure_rating_bar DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(LineString, 4326) NOT NULL,
    length_km DOUBLE PRECISION NOT NULL,
    source_station_id UUID REFERENCES stations(id) ON DELETE RESTRICT,
    target_station_id UUID REFERENCES stations(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Spatial index on pipelines geometry
CREATE INDEX IF NOT EXISTS idx_pipelines_geom ON pipelines USING GIST(geom);

-- 5. Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES stations(id) ON DELETE CASCADE,
    pipeline_id UUID REFERENCES pipelines(id) ON DELETE CASCADE,
    asset_tag VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL CHECK (type IN ('METER', 'VALVE', 'REGULATOR', 'TRANSMITTER')),
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    installation_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'OPERATIONAL' NOT NULL CHECK (status IN ('OPERATIONAL', 'FAULTY', 'STANDBY')),
    technical_specs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_asset_owner CHECK (
        (station_id IS NOT NULL AND pipeline_id IS NULL) OR
        (station_id IS NULL AND pipeline_id IS NOT NULL)
    )
);

-- 6. Maintenance Orders Table
CREATE TABLE IF NOT EXISTS maintenance_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('PREVENTIVE', 'CORRECTIVE', 'INSPECTION')),
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    assigned_to_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    scheduled_date DATE NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE,
    completion_logs JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. IoT Sensors Table
CREATE TABLE IF NOT EXISTS iot_sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    sensor_tag VARCHAR(100) UNIQUE NOT NULL,
    sensor_type VARCHAR(100) NOT NULL CHECK (sensor_type IN ('PRESSURE', 'FLOW_RATE', 'TEMPERATURE', 'VALVE_STATUS')),
    status VARCHAR(50) DEFAULT 'ONLINE' NOT NULL CHECK (status IN ('ONLINE', 'OFFLINE', 'ERROR')),
    last_ping TIMESTAMP WITH TIME ZONE,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. Telemetry Data Table (Time-Series partitioned by month)
CREATE TABLE IF NOT EXISTS telemetry_data (
    id BIGSERIAL,
    sensor_id UUID NOT NULL REFERENCES iot_sensors(id) ON DELETE CASCADE,
    reading_value DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- Default subpartition example (Created dynamically or in migrations)
CREATE TABLE IF NOT EXISTS telemetry_data_y2026m06 PARTITION OF telemetry_data
    FOR VALUES FROM ('2026-06-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');

-- 9. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id UUID NOT NULL REFERENCES iot_sensors(id) ON DELETE CASCADE,
    alert_type VARCHAR(100) NOT NULL CHECK (alert_type IN ('HIGH_PRESSURE', 'LOW_PRESSURE', 'HIGH_FLOW', 'OFFLINE')),
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')),
    acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
