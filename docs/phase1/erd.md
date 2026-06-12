# GasGrid — Phase 1 ERD (Conceptual + Logical)

This ERD covers core domain entities required for Phase 1: Stations, Pipelines, Assets, Sensors, Telemetry, Users/Roles, WorkOrders, MaintenanceRecords and Audit logs.

## Conceptual model
- Station (city gate, customer) — has location (geometry), metadata, service capacity
- Pipeline — polyline geometry, type (trunk/spur), material, status
- Asset — equipment tied to stations or pipelines (meters, valves, compressors)
- Sensor — physical sensor assigned to an asset or station, with MQTT credentials and telemetry schema
- Telemetry — time-series measurements from sensors (pressure, flow, temp)
- WorkOrder — maintenance work order referencing assets/stations
- MaintenanceRecord — historical records of maintenance events
- User / Role / Permission — auth model integrated with Keycloak, replicated in local RBAC tables for fast checks
- AuditLog — write-ahead audit of CRUD operations, stored as JSONB with metadata

## Logical schema (tables)

1. users
- id (uuid, PK)
- keycloak_id (uuid, nullable)
- username (text, unique)
- email (text)
- full_name (text)
- created_at (timestamp)
- updated_at (timestamp)

2. roles
- id (uuid, PK)
- name (text, unique)
- description (text)

3. permissions
- id (uuid, PK)
- name (text, unique)
- description (text)

4. role_permissions
- role_id (uuid, FK roles.id)
- permission_id (uuid, FK permissions.id)

5. stations
- id (uuid, PK)
- code (text, unique)
- name (text)
- type (enum: city_gate, customer, regulator)
- geom (geometry(Point, 4326))
- address (text)
- status (enum)
- metadata (jsonb)
- created_at, updated_at

6. pipelines
- id (uuid, PK)
- code (text, unique)
- name (text)
- type (enum: trunk, spur)
- geom (geometry(LineString, 4326))
- material (text)
- diameter_mm (numeric)
- installed_at (date)
- status (enum)
- metadata (jsonb)

7. assets
- id (uuid, PK)
- station_id (uuid, FK stations.id, nullable)
- pipeline_id (uuid, FK pipelines.id, nullable)
- asset_type (enum: meter, valve, regulator, compressor)
- serial_number (text)
- metadata (jsonb)

8. sensors
- id (uuid, PK)
- asset_id (uuid, FK assets.id)
- sensor_type (enum: pressure, flow, temp, battery)
- mqtt_client_id (text)
- mqtt_topic (text)
- provisioning_cert_id (text)
- status (enum)

9. telemetry
- id (bigserial, PK)
- sensor_id (uuid, FK sensors.id)
- ts (timestamptz)
- payload (jsonb) -- raw message
- pressure_pa (numeric, nullable)
- flow_m3s (numeric, nullable)
- temperature_c (numeric, nullable)

10. work_orders
- id (uuid, PK)
- code (text, unique)
- title (text)
- description (text)
- created_by (uuid, FK users.id)
- assigned_to (uuid, FK users.id)
- related_asset_id (uuid, FK assets.id)
- status (enum)
- created_at, updated_at

11. maintenance_records
- id (uuid, PK)
- work_order_id (uuid, FK work_orders.id)
- performed_by (uuid, FK users.id)
- performed_at (timestamptz)
- notes (text)
- attachments (jsonb)

12. audit.audit_log
- id (bigserial, PK)
- entity (text)
- entity_id (uuid)
- action (enum: insert, update, delete)
- changed_by (uuid)
- changed_at (timestamptz)
- delta (jsonb)

---
Next: generate SQL DDL for these tables with PostGIS geometry types and indexes.
