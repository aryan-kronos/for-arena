# ARANCH PASS pre-launch website

A React/Vite pre-launch site for the physical–digital service identity concept.

## Commands

```bash
npm ci
npm run dev
npm run typecheck
npm run audit:security
npm run build
npm run preview
```

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- local/self-hosted Archivo, Manrope and IBM Plex Mono font assets
- `qrcode.react` for the scannable demo QR

## Current product-asset truth

Only two product images are approved and retained:

```text
public/images/aranch-pass-passport-seal.webp
public/images/aranch-pass-fifty-box.webp
```

The interactive pass uses the approved pass JPG as its front texture. A real QR component is aligned over the concept-art QR. It currently encodes an explicit pre-launch demo string—not a production URL. Replace `DEMO_QR_VALUE` in `src/components/PassArtwork.tsx` only after the production domain and public-token route exist.

The Chapter 5 box uses the approved box image. Rejected AI appliance scenes, fictional batches and arbitrary pass composites were removed.

## Important status

- no customer/provider reviews;
- no field pilots;
- no final pricing;
- no production batch;
- no final physical dimensions/material specification;
- no database connection in the default build;
- no real WhatsApp number or contact inbox.

The website must continue to state these limitations honestly.

## Lead-capture integration

The form calls the typed boundary in:

```text
src/lib/pilotLead.ts
```

Set an HTTPS server/edge endpoint in `.env`:

```bash
VITE_PILOT_API_URL=https://your-api.example/pilot-leads
```

Never expose database credentials or privileged service keys through `VITE_*` variables. The server endpoint must validate input, rate-limit, store consent metadata and return JSON. Without this environment variable, the UI clearly reports that nothing was transmitted or stored.

## Supabase and database planning

- Browser client: `src/lib/supabase.ts`
- Architecture: `docs/DATABASE_ARCHITECTURE.md`
- PostgreSQL foundation: `database/schema.sql`
- Supabase RLS foundation: `database/002_supabase_rls.sql`

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel. The anon key is public by design; security comes from RLS. Never put the service-role key in a `VITE_*` variable. Provider/customer/admin tables remain inaccessible until tenant membership policies are implemented and tested.

## Deployment pricing and public configuration

Pricing, contact details, site URL and Supabase values are controlled through the variables documented in `.env.example`. Vercel embeds `VITE_*` values at build time, so changing them requires a redeploy.

## Authentication and role-specific portals

- `/customer` — public customer code/QR entry; no signup
- `/login` — shared provider and CEO login
- `/signup` — phone + username + OTP + password provider signup
- `/provider` — role-guarded provider portal
- `/ceo` — role-guarded platform/CEO portal

Demo credentials are documented in `docs/AUTH_AND_PORTALS.md`. They are deliberately insecure and must be disabled in production with `VITE_ENABLE_DEMO_AUTH=false` after Supabase Auth and role rows are configured.

## Installable PWA

`vite-plugin-pwa` generates the service worker and manifest. Install prompts appear only when the browser reports the app as installable; iOS users receive Add-to-Home-Screen instructions. Icons are in `public/icons/`; the manifest includes customer-portal and provider-login shortcuts. Test installation on HTTPS production/staging because service workers are restricted outside HTTPS/localhost.

## Customer-safe service export

The public customer demo supports date-range and service-type filtering and generates a downloadable PDF using a dynamically loaded `jsPDF` bundle. The export intentionally excludes customer identity, phone, address, payment and private notes.

## Location autofill

`LocationFields` supports bidirectional Indian address assistance:

- six-digit PIN → city/district/state/post-office suggestions;
- city → ranked PIN/post-office suggestions.

It uses the India postal PIN API with a small verified GPO fallback list. A city can contain many PIN codes, so the interface always asks the provider to verify/select the correct post office instead of treating a state or city as a unique address.

## SEO and founder identity

`npm run generate:seo` builds:

- `sitemap.xml`
- `robots.txt`
- a dedicated `/founder/` page identifying **Aryan as Founder and CEO**

The homepage also includes Organization/Person JSON-LD and visible founder copy. Set both `SITE_URL` and `VITE_SITE_URL` to the final production origin in Vercel before deployment. Search-engine display is controlled by Google and cannot be guaranteed.

## Main components

```text
src/components/InteractivePass.tsx     3D interaction and edge stack
src/components/PassArtwork.tsx         approved front image, real demo QR, reverse
src/components/Scene.tsx               standalone product object only
src/components/sections/*              page chapters
src/hooks/useReveal.ts                 coordinated section reveal with fallback
src/lib/pilotLead.ts                   typed lead API boundary
src/data.ts                            copy/configuration
```

## Product-model rules

1. Do not redraw the pass with AI.
2. Do not paste it arbitrarily onto appliance photographs.
3. Do not label concept images as real batches or material tests.
4. Do not print the current demo QR.
5. Lock physical scale, substrate, adhesive and placement before contextual photography.
6. Public scan endpoints must never return customer phone, address, payment or private notes.

## Audit

See `WEBSITE_AUDIT.md` for the detailed implementation audit, confirmed defects and remediation sequence.
