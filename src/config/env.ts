const clean = (value: string | undefined) => value?.trim() || undefined;
const bool = (value: string | undefined, fallback = false) => {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

/** Public build-time configuration. Never place secrets in VITE_* variables. */
export const publicEnv = {
  siteUrl: clean(import.meta.env.VITE_SITE_URL),
  pilotApiUrl: clean(import.meta.env.VITE_PILOT_API_URL),
  supabaseUrl: clean(import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: clean(import.meta.env.VITE_SUPABASE_ANON_KEY),
  demoAuthEnabled: bool(import.meta.env.VITE_ENABLE_DEMO_AUTH, true),
  contactEmail: clean(import.meta.env.VITE_CONTACT_EMAIL) ?? "hello@aranchpass.example",
  whatsappHref: clean(import.meta.env.VITE_WHATSAPP_URL) ?? "",
  pricingVisible: bool(import.meta.env.VITE_PRICING_VISIBLE, false),
  pricingLabel: clean(import.meta.env.VITE_PRICING_LABEL) ?? "Pilot pricing — subject to confirmation",
  softwarePrice: clean(import.meta.env.VITE_SOFTWARE_PRICE) ?? "Pricing not published yet",
  passPackPrice: clean(import.meta.env.VITE_PASS_PACK_PRICE) ?? "Pricing not published yet",
  combinedPilotPrice: clean(import.meta.env.VITE_COMBINED_PILOT_PRICE) ?? "Pricing not published yet",
} as const;
