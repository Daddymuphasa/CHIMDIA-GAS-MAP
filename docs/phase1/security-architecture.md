# Security Architecture — GasGrid Phase 1

## Principles

- Zero trust: authenticate and authorize every request.
- Least privilege: role-based access and scoped tokens.
- Defense in depth: multiple layers of controls.
- Auditability: immutable audit trails for critical operations.

## Identity & Access Management

- Keycloak for identity provider, configured with:
  - OIDC clients for UI and service-to-service tokens.
  - MFA for privileged roles.
  - Role mappings aligned with `core.roles` for local RBAC caching.

## Network & Transport Security

- TLS everywhere: HTTPS for UI/API, MQTT over TLS for sensors.
- Enforce mTLS for internal service-to-service communication where possible.
- Network segmentation: separate namespaces and network policies for ingress, core services, and telemetry ingestion.

## Data Security

- At-rest encryption for PVs; MinIO server-side encryption for objects.
- Field-level encryption for sensitive fields if needed.
- Use Vault for secrets management and rotation.

## Sensor/device security

- Provision sensors with client certificates bound to a device identity.
- Use EMQX ACLs and topic restrictions; register each sensor with a unique client ID and topic namespace.

## Audit & Logging

- Write all domain changes to `audit.audit_log` (immutable append-only); replicate to external WORM storage if required.
- Centralized logging to Loki with controlled retention and secure access.

## Hardening

- Container image signing and vulnerability scanning (Trivy, Clair) in CI.
- Regular pentests and security reviews.

## Compliance & Data Sovereignty

- Keep all data in NGML-controlled regions; define data residency per dataset.

## Incident Response

- Define incident playbooks: data compromise, sensor spoofing, RCE, DB compromise.
