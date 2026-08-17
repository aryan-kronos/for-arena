/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_PILOT_API_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_ENABLE_DEMO_AUTH?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_WHATSAPP_URL?: string;
  readonly VITE_PRICING_VISIBLE?: string;
  readonly VITE_PRICING_LABEL?: string;
  readonly VITE_SOFTWARE_PRICE?: string;
  readonly VITE_PASS_PACK_PRICE?: string;
  readonly VITE_COMBINED_PILOT_PRICE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
