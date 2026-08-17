-- ARANCH PASS PostgreSQL foundation
-- Review with the selected auth/database platform before applying.
create extension if not exists pgcrypto;

create type membership_role as enum ('owner','manager','technician','support');
create type pass_status as enum ('printed','assigned','active','revoked','archived');
create type subscription_status as enum ('trial','active','past_due','cancelled','expired');

create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  city text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  display_name text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

create table business_memberships (
  business_id uuid not null references businesses(id),
  user_id uuid not null references users(id),
  role membership_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (business_id,user_id)
);

create table provider_contacts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  kind text not null check (kind in ('whatsapp','call','email','billing')),
  value text not null,
  is_public boolean not null default false,
  priority integer not null default 0,
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  display_name text,
  phone_encrypted text,
  locality text,
  pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index customers_business_phone_idx on customers(business_id,phone_encrypted);

create table assets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  customer_id uuid references customers(id),
  category text not null,
  safe_label text not null,
  brand text,
  model text,
  serial_encrypted text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index assets_business_customer_idx on assets(business_id,customer_id);

create table passes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id),
  short_code text not null unique,
  public_token_hash text not null unique,
  print_batch text,
  sequence_number integer,
  status pass_status not null default 'printed',
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);
create index passes_business_status_idx on passes(business_id,status);

create table pass_assignments (
  id uuid primary key default gen_random_uuid(),
  pass_id uuid not null references passes(id),
  asset_id uuid not null references assets(id),
  assigned_by uuid not null references users(id),
  assigned_at timestamptz not null default now(),
  ended_at timestamptz,
  reason text
);
create unique index one_active_pass_assignment on pass_assignments(pass_id) where ended_at is null;

create table service_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  asset_id uuid not null references assets(id),
  technician_id uuid not null references users(id),
  service_type text not null,
  serviced_at timestamptz not null,
  public_summary text,
  private_notes text,
  amount_minor integer check (amount_minor is null or amount_minor >= 0),
  next_recommended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index service_events_asset_date_idx on service_events(asset_id,serviced_at desc);
create index service_events_business_due_idx on service_events(business_id,next_recommended_at);

create table customer_consents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  customer_id uuid not null references customers(id),
  purpose text not null,
  granted boolean not null,
  wording_version text not null,
  source text not null,
  recorded_by uuid references users(id),
  recorded_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  provider text,
  external_reference text,
  plan_code text not null,
  status subscription_status not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pass_orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  status text not null default 'draft',
  quantity integer not null check (quantity > 0),
  amount_minor integer check (amount_minor is null or amount_minor >= 0),
  shipping_address_encrypted text,
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pilot_leads (
  id uuid primary key default gen_random_uuid(),
  contact text not null,
  name text,
  business_name text,
  city text,
  district text,
  state text,
  pincode text,
  post_office text,
  service_category text,
  source text not null,
  consent_text_version text not null,
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table audit_events (
  id bigint generated always as identity primary key,
  business_id uuid references businesses(id),
  actor_user_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_events_business_date_idx on audit_events(business_id,created_at desc);

-- Row-level security policies are platform/auth specific and MUST be added
-- before exposing tables through any client-accessible database API.
