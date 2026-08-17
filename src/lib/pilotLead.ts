import { publicEnv } from "@/config/env";

export type PilotLeadInput = {
  contact: string;
  name?: string;
  businessName?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  postOffice?: string;
  serviceCategory?: string;
  source: "website-pilot-form";
  consentTextVersion: "2026-08-17";
};

export type PilotLeadResult =
  | { stored: true; id?: string }
  | { stored: false; reason: "not-configured" };

/**
 * Lead capture with two secure deployment options:
 * 1. HTTPS server/edge endpoint (preferred when custom abuse controls are needed)
 * 2. Supabase anon insert protected by an INSERT-only RLS policy
 *
 * Database credentials/service-role keys are never shipped to the browser.
 */
export async function submitPilotLead(input: PilotLeadInput): Promise<PilotLeadResult> {
  if (publicEnv.pilotApiUrl) {
    const response = await fetch(publicEnv.pilotApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`Lead submission failed with status ${response.status}`);
    const data = (await response.json().catch(() => ({}))) as { id?: string };
    return { stored: true, id: data.id };
  }

  const { getSupabaseBrowserClient } = await import("@/lib/supabase");
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { stored: false, reason: "not-configured" };

  const { error } = await supabase.from("pilot_leads").insert({
    contact: input.contact,
    name: input.name ?? null,
    business_name: input.businessName ?? null,
    city: input.city ?? null,
    district: input.district ?? null,
    state: input.state ?? null,
    pincode: input.pincode ?? null,
    post_office: input.postOffice ?? null,
    service_category: input.serviceCategory ?? null,
    source: input.source,
    consent_text_version: input.consentTextVersion,
  });

  if (error) throw new Error(error.message);
  return { stored: true };
}
