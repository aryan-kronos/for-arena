# ARANCH PASS database architecture

This document defines the production data boundary before a database vendor is selected. The recommended implementation is PostgreSQL behind a server/edge API. Browser code must never receive database passwords or privileged service keys.

## Core principles

1. **Multi-tenant isolation:** every provider-owned row carries `business_id`; server authorization checks membership on every request.
2. **Append service history:** each visit is a new `service_event`; previous history is not overwritten.
3. **Public token separation:** the QR token is random and separate from internal IDs and customer identity.
4. **Minimum public data:** public scan endpoints return a dedicated safe projection, never raw customer rows.
5. **Individual technician identity:** no shared business login; every mutation records an actor.
6. **Consent ledger:** reminder consent stores wording version, source and timestamp.
7. **Auditability:** sensitive mutations write immutable audit events.
8. **Soft lifecycle states:** revoke/archive passes and users rather than deleting history casually.

## Main entities

- `businesses` — provider tenant.
- `users` — authenticated identity reference.
- `business_memberships` — owner, manager, technician or support role.
- `provider_contacts` — public WhatsApp/call contact versus private billing contact.
- `customers` — tenant-scoped customer record; phone/address protected.
- `assets` — maintained purifier/equipment linked to customer.
- `passes` — printed physical identifier, random public token hash and short code.
- `pass_assignments` — append-only history of pass-to-asset assignment/replacement.
- `service_events` — every service visit.
- `customer_consents` — reminder/privacy consent records.
- `subscriptions` — provider plan and status.
- `pass_orders` / `pass_order_items` — physical pack fulfilment.
- `pilot_leads` — marketing-site interest before onboarding.
- `audit_events` — privileged activity history.

## Public scan API

`GET /public/pass/:token`

Returns only:

- provider display name;
- approved public contacts;
- safe asset label/category;
- short asset code;
- last service date;
- next recommended date;
- public work summary;
- pass status needed for safe error handling.

It must never return customer ID, customer phone, address, amount, private note, internal user IDs or raw service attachments.

## Provider API boundary

All provider routes require authenticated membership and tenant checks. A technician should normally access only permitted/assigned assets; owner/manager roles can access the tenant dashboard. Cross-tenant IDs must return not found/forbidden even when guessed.

## QR/token design

- Printed short code: random, human-readable, checksum recommended.
- Public URL token: at least 128 bits of cryptographic randomness.
- Store a hash of the public token where practical.
- Never use sequential IDs in public URLs.
- Support revocation and replacement without deleting service history.
- The current website QR is explicitly a demo string and must not be printed.

## Attachments

Use private object storage. Store metadata in PostgreSQL and issue short-lived signed URLs after authorization. Do not make invoices/service photos public by default.

## Data retention and rights

Before launch, define:

- provider export when subscription ends;
- customer correction/disassociation process;
- retention after business closure;
- deletion/anonymisation boundaries where records have legitimate accounting/safety reasons;
- support-access logging;
- incident response and backups.

## Recommended deployment stages

1. Marketing lead endpoint only.
2. Provider auth and tenant creation.
3. Pass inventory/activation.
4. Customer/asset/service records.
5. Safe public scan endpoint.
6. Due-service list.
7. Consent-based outbound messaging only after WhatsApp/API compliance is confirmed.
8. Orders/subscriptions after contracts, invoicing and tax setup are reviewed.
