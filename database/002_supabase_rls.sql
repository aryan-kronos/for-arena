-- Supabase row-level security foundation.
-- Apply after schema.sql. Review all policies before production.

alter table pilot_leads enable row level security;

-- Anonymous visitors may submit a constrained pilot lead but cannot read,
-- update or delete any lead. Add CAPTCHA/rate limiting at an Edge Function for
-- public promotion or sustained traffic.
create policy "anon can submit constrained pilot leads"
on pilot_leads
for insert
to anon
with check (
  char_length(contact) between 7 and 254
  and char_length(coalesce(name, '')) <= 120
  and char_length(coalesce(business_name, '')) <= 160
  and char_length(coalesce(city, '')) <= 120
  and char_length(coalesce(district, '')) <= 120
  and char_length(coalesce(state, '')) <= 120
  and (pincode is null or pincode ~ '^[0-9]{6}$')
  and char_length(coalesce(post_office, '')) <= 160
  and char_length(coalesce(service_category, '')) <= 120
  and source = 'website-pilot-form'
  and consent_text_version = '2026-08-17'
);

-- No SELECT policy is intentionally granted to anon/authenticated roles here.
-- Platform administrators should read leads only through a server-side role or
-- a separately reviewed admin policy with MFA and audit logging.

alter table businesses enable row level security;
alter table users enable row level security;
alter table business_memberships enable row level security;
alter table provider_contacts enable row level security;
alter table customers enable row level security;
alter table assets enable row level security;
alter table passes enable row level security;
alter table pass_assignments enable row level security;
alter table service_events enable row level security;
alter table customer_consents enable row level security;
alter table subscriptions enable row level security;
alter table pass_orders enable row level security;
alter table audit_events enable row level security;

-- Provider/application policies are deliberately not guessed in this migration.
-- Tables remain inaccessible through Supabase's client API until role and tenant
-- membership policies are implemented and tested.
