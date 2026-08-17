-- Supabase Auth + portal-role foundation.
create extension if not exists citext;

alter table users add column if not exists username citext;
alter table users add column if not exists city text;
alter table users add column if not exists district text;
alter table users add column if not exists state text;
alter table users add column if not exists pincode text;
alter table users add column if not exists post_office text;
alter table users add column if not exists portal_role text not null default 'provider'
  check (portal_role in ('provider'));
create unique index if not exists users_username_unique on users(username) where username is not null;

-- Run only if the FK does not already exist in your migration environment.
do $$ begin
  alter table users add constraint users_auth_user_fk foreign key (id) references auth.users(id) on delete cascade;
exception when duplicate_object then null;
end $$;

create table if not exists platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  granted_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
alter table platform_admins enable row level security;

-- A signed-in user may create/read/update only their own provider profile.
create policy "users insert own provider profile" on users
for insert to authenticated
with check (id = auth.uid() and portal_role = 'provider');

create policy "users read own profile" on users
for select to authenticated
using (id = auth.uid());

create policy "users update own provider profile" on users
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid() and portal_role = 'provider');

-- Role resolution is server-evaluated. Client input never decides CEO access.
create or replace function get_my_portal_role()
returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then return null; end if;
  if exists(select 1 from platform_admins where user_id = auth.uid()) then return 'ceo'; end if;
  if exists(select 1 from users where id = auth.uid() and portal_role = 'provider') then return 'provider'; end if;
  return null;
end;
$$;
revoke all on function get_my_portal_role() from public;
grant execute on function get_my_portal_role() to authenticated;

-- No client policies are granted on platform_admins. CEO assignments must be
-- made with a reviewed server-side/admin process and logged.
