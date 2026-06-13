# Deployment Architecture — GasGrid Phase 1

## Objectives

- Self-hosted deployment model for NGML datacenters or private cloud.
- Kubernetes-ready architecture with initial Docker Compose for dev.
- Network segmentation and hardened defaults.

## Environment layout

- Management Network: CI/CD, admin tooling
- Control Plane: Kubernetes control plane (if using managed k8s, ensure private networking)
- Application Plane: Namespaces for `infra`, `platform`, `monitoring`, `ingest`, `staging`, `prod`.
- Edge/IoT Network: Segmented DMZ for EMQX gateways; TLS termination and firewall rules.

## Infrastructure components

- Load Balancer / Ingress (NGINX Ingress Controller or internal load balancer)
- API Services: NestJS deployments (stateless)
- Frontend: Next.js served via CDN (internal) or from Node server behind Ingress
- Database: PostgreSQL (primary + replicas) with Patroni for HA and automated failover
- GeoServer: StatefulSet with persistent volumes (tile caching layer)
- EMQX: StatefulSet or VM-based cluster with persistent session store
- MinIO: distributed MinIO cluster with erasure coding
- Keycloak: highly available Keycloak cluster with external DB
- Prometheus/Grafana/Loki: monitoring stack in `monitoring` namespace

## Storage

- Use enterprise SAN or Ceph/Rook for PVs; MinIO stores objects on redundant PVs.

## Networking & Security

- Private cluster endpoints; no public internet exposure for backend services.
- Use network policies to restrict pod-to-pod communication.
- Ingress TLS with certs from internal CA; mTLS between services using SPIRE or Istio (optional).

## CI/CD

- GitOps with ArgoCD or Flux for declarative cluster config.
- Build pipelines produce Docker images stored in internal registry (Harbor).

## Dev vs Prod

- Docker Compose for local dev with trimmed configuration (single-node Postgres with PostGIS, single GeoServer, single EMQX, Keycloak dev instance).
- Production uses Kubernetes with scaling policies and separate namespaces for multi-tenant separation if required.

## Secrets

- Use HashiCorp Vault or Kubernetes sealed-secrets; never store plaintext secrets in git.

## Backup

- Use scheduled jobs for `pgBackRest` to MinIO; snapshot PVs for GeoServer/Keycloak/MinIO configuration backups.

## Runbook highlights

- Steps to restore Postgres from backup.
- How to failover Postgres with Patroni.
- How to re-provision EMQX node and re-attach sessions.
