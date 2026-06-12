# GasGrid — Phase 1 System Architecture Document

Version: 0.1
Author: NGML / Principal Architect (draft)
Date: 2026-06-12

## Purpose
This document defines the target, production-grade architecture for the GasGrid platform (Phase 1 deliverable). It captures components, data flow, non-functional requirements, constraints, and operational expectations required before Phase 2 implementation.

## Scope
- Produce a self-hosted, NGML-controlled platform to visualize and operate the gas distribution network for the Ibafo City Gate Network with nationwide scalability.
- Phase 1 artifacts only: architecture, ERD, database schema, API spec, deployment and security architecture, folder structure and roadmap.

## Goals & Priorities
All design decisions prioritize, in order:
- Security
- Scalability
- Maintainability
- Reliability
- Auditability
- Data sovereignty (all components runnable inside NGML environments)
- GIS accuracy (EPSG:4326 / clearly defined reprojection rules)

## Constraints
- No reliance on external mapping providers or hosted SaaS for GIS tiles or storage.
- All services must be operable inside NGML networks (on-prem / private cloud).
- Use the approved technology stack (Next.js, NestJS, PostgreSQL/PostGIS, GeoServer, EMQX, Keycloak, MinIO, Prometheus/Grafana/Loki).

## High-level architecture
```mermaid
graph LR
  subgraph Users
    U[Operators / Engineers / Admins]
  end
  U -->|HTTPS + OIDC| FE[Next.js (UI)]
  FE -->|REST / GraphQL| APIGW[API Gateway / NestJS Services]
  APIGW -->|SQL| DB[(PostgreSQL + PostGIS)]
  APIGW --> Geo[GeoServer (tiles/vector services)]
  APIGW --> MinIO[MinIO (object store)]
  APIGW --> Auth[Keycloak (OIDC)]
  Sensors -->|MQTT/TLS| EMQX[EMQX MQTT Cluster]
  EMQX --> Ingest[Telemetry Ingest Service]
  Ingest --> DB
  Ingest --> MinIO
  APIGW --> Reporting[Reporting (Puppeteer) Worker]
  APIGW --> Alerts[Alert Engine]
  APIGW --> Audit[(Audit DB / JSONB logs)]
  Monitoring --> Prom[Prometheus]
  Logging --> Loki[Loki]
  Prom --> Graf[Grafana]
```

### Components (brief)
- Frontend: Next.js (TypeScript, TailwindCSS) — client app uses internal vector tiles + custom basemap served by GeoServer or vector-tile service; rendering via Leaflet or custom renderer.
- API Layer: NestJS microservices behind an API gateway / ingress; services are REST/HTTP + optional gRPC for internal high-throughput channels.
- Auth: Keycloak realm for SSO, MFA, RBAC groups and client scopes.
- GIS: PostgreSQL + PostGIS for authoritative geometry storage; GeoServer for rendering and WFS/WMS/Vector-Tile endpoints (self-hosted).
- IoT: EMQX cluster for secure MQTT ingestion; ingestion microservice consumes messages and writes to telemetry time-series tables.
- Storage: MinIO S3-compatible object storage for backups, large reports, exported GIS packages.
- Observability: Prometheus, Grafana, Loki for metrics, dashboards and logs.
- Reporting: Puppeteer-based service to render branded PDFs from server-side templates or UI snapshots.

## Data flows
- Telemetry: Sensor -> MQTT (TLS, client cert) -> EMQX -> Ingest Service -> Telemetry DB (partitioned/hypertable), also archived to MinIO for long-term retention.
- GIS edits: UI -> API -> DB (PostGIS) -> GeoServer cache invalidation -> FE updates; geometry validations occur in the API prior to commit.
- Asset & maintenance records: CRUD via API -> normalized relational tables; changes are written to `audit.audit_log` for traceability and compliance.

## Scalability & HA
- Stateless services: horizontal scaling (Kubernetes HPA) with readiness/liveness probes.
- PostgreSQL: primary + synchronous/async replicas, automatic failover (Patroni or equivalent) for HA. Telemetry uses time-based partitioning and optionally TimescaleDB hypertables for scale.
- EMQX: clustered with shared session store, scaled horizontally for high MQTT throughput.

## Observability & SLOs
- Collect metrics (Prometheus) and logs (Loki). Dashboards in Grafana; alerts via Alertmanager and the Alert Engine for operational thresholds (e.g., sensor offline, sustained pressure anomalies).
- Example SLOs (to be refined): availability 99.9% for core APIs, telemetry ingestion latency <5s under nominal load, MTTR targets for critical incidents.

## Backups & DR
- PostgreSQL backups using `pgBackRest` or WAL shipping to an internal MinIO bucket with encrypted transfer.
- DR runbooks and RTO/RPO targets established per NGML policy; periodic failover drills recommended.

## Security controls (summary)
- Mutual TLS for inter-service and MQTT sensor communication.
- OIDC/OAuth2 for user authentication; RBAC enforced in Keycloak and validated in API middleware.
- Secrets stored in HashiCorp Vault (recommended) or Kubernetes Secrets encrypted at rest.
- Least privilege, network segmentation via Kubernetes NetworkPolicies, and audit logging for all CRUD operations.

## GIS accuracy & validation
- Store geometries in EPSG:4326; APIs accept/return GeoJSON and enforce SRID. Server validates geometry (SRID, topology, snapping, minimum segment length) before accepting edits.
- Maintain explicit topology tables for network nodes and edges; implement constraints assuring connectivity, single source of truth for pipeline topology.

## Assumptions & Open Questions
- Expected number of sensors and average telemetry message rate — impacts ingestion and storage design.
- Regulatory retention policy for telemetry and audit logs.
- Device provisioning method and PKI lifecycle for sensor certificates.

## Acceptance criteria for Phase 1
- System architecture document reviewed and approved by NGML stakeholders.
- ERD validated and signed off for core entities.
- DB schema and migration plan ready for Phase 2 implementation.
- API spec reviewed and compatible with Keycloak OIDC flows.

---
Next: ERD, database DDL, OpenAPI, deployment and security documents will be created under `docs/phase1/` for review.
