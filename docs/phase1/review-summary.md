# ERD & API Review Summary — Phase 1

Date: 2026-06-12

## Quick findings
- ERD covers core entities required for Phase 1 and captures spatial tables (`stations`, `pipelines`) with PostGIS geometry columns.
- `telemetry` table is defined as a non-partitioned table in the DDL but notes recommend partitioning; partitioning strategy must be implemented in migrations.
- `audit.audit_log` strategy is present and a sample trigger added for `stations`. Triggers should be implemented for all write-heavy domain tables and integrated with application-level `changed_by` context.
- OpenAPI draft includes basic station endpoints but lacks pagination, filtering models, error schemas, RBAC scopes, examples, and full request/response definitions.

## Issues & Recommendations
1. Telemetry scale and storage
   - Issue: `telemetry` must be partitioned (daily/monthly) or use TimescaleDB hypertables.
   - Recommendation: adopt TimescaleDB for time-series or implement daily partitions via migrations; add TTL lifecycle jobs to move cold data to MinIO.

2. Audit logging enriched context
   - Issue: current audit triggers do not capture `changed_by` (user id) or request metadata.
   - Recommendation: use application-level audit insertion (preferred) passing `current_setting('app.current_user')` or use SET LOCAL in transactions to inject user context.

3. Geometry/topology constraints
   - Issue: no explicit topology tables or constraints for network connectivity.
   - Recommendation: add `network_nodes`, `network_edges` tables and constraints ensuring pipelines connect to nodes; implement PostgreSQL ASSERTION-style checks or application validation functions.

4. OpenAPI completeness
   - Issue: missing pagination, errors, examples, and RBAC scopes.
   - Recommendation: extend OpenAPI with `components/schemas/PaginatedResponse`, `components/schemas/Error`, and document scopes (`stations:read`, `stations:write`). Add examples and schema validation.

5. Sensor & device provisioning
   - Issue: sensor provisioning fields are minimal; certificate lifecycle not specified.
   - Recommendation: define `device_certificates` table and PKI workflows, device statuses, revocation lists.

6. Data sovereignty & backups
   - Issue: backup cadence and retention policies are not defined.
   - Recommendation: define RTO/RPO, backup frequencies, retention, and S3 lifecycle rules on MinIO for long-term archives.

## Action items before Phase 2
- Finalize telemetry sizing (messages/sec, retention) and choose TimescaleDB vs native partitioned Postgres.
- Implement application-level audit pattern to ensure `changed_by` is recorded.
- Expand OpenAPI with pagination, filtering, error models, and RBAC scopes.
- Add topology model and spatial validation constraints.
- Define device provisioning and certificate lifecycle DDL.

---
I can proceed to implement the recommended schema changes and expand the OpenAPI spec now, or prepare a stakeholder-ready presentation summarizing these points. Which would you prefer? 
