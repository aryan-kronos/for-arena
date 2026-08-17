# Authentication and portal architecture

## Public customer access

Customers do not create accounts for ordinary use. `/customer` accepts an asset code; production QR links will open a safe public pass route. Only the reviewed public projection is returned.

## Shared provider/CEO login

`/login` accepts:

- phone number + password;
- username + password.

The identity provider authenticates the account. `get_my_portal_role()` then resolves access:

- `platform_admins` membership → CEO/platform portal;
- normal provider profile → provider portal.

Client input never assigns CEO access.

## Provider signup

1. Enter phone with country code.
2. Supabase sends SMS OTP.
3. Enter username, OTP and password.
4. OTP creates/verifies the auth user.
5. Password is set on the verified account.
6. Provider profile is inserted with role constrained to `provider` by RLS.

Usernames are case-insensitive and unique. Production should add CAPTCHA/Turnstile and SMS abuse limits.

## Username login

Supabase Auth signs in natively with phone+password but not username+password. The included Edge Function `username-login`:

1. receives username and password over HTTPS;
2. resolves username→phone using the service role inside the function;
3. signs in through Supabase Auth;
4. returns session tokens;
5. uses generic invalid-credential errors to reduce username enumeration.

Apply rate limiting/CAPTCHA before public launch. Never log request bodies or passwords.

## Demo credentials

When `VITE_ENABLE_DEMO_AUTH=true`:

- CEO: `admin123` / `admin123`
- Provider: `provider123` / `provider123`
- Local signup OTP: `123456`

These are client-visible demonstration credentials and provide no security. Disable demo auth in production after Supabase roles are configured.

## Current routes

- `/customer` — public lookup entry
- `/login` — provider and CEO login
- `/signup` — provider signup
- `/provider` — provider portal, role guarded
- `/ceo` — CEO/platform portal, role guarded

The role guards currently use a sessionStorage demo session or Supabase session result. Production hardening must also protect every API/database operation server-side; route guards are UX, not authorization.
