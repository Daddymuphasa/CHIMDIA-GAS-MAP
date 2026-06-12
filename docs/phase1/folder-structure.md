# Monorepo Folder Structure (recommended)

Root layout (monorepo):

- apps/
  - web/ (Next.js frontend)
  - api/ (NestJS monorepo or microservices)
  - ingest/ (Telemetry ingestion service)
  - geoserver/ (GeoServer configuration repo)

- libs/
  - db/ (shared DB models, migrations)
  - gis/ (geometry utils, validation rules)
  - ui/ (design system)
  - auth/ (Keycloak clients, roles mapping)

- infra/
  - docker/ (dev compose)
  - k8s/ (helm charts / manifests)
  - terraform/ (if provisioning infra)

- scripts/ (dev scripts, migration helpers)
- docs/ (architecture + runbooks)
- tests/ (integration & e2e)
- .github/ (CI workflows)

Notes:
- Use Nx or Turborepo for monorepo task orchestration.
