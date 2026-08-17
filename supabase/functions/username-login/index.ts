import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  try {
    const { username, password } = await request.json();
    if (typeof username !== "string" || typeof password !== "string" || username.length > 64 || password.length > 256) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    const { data: profile } = await admin
      .from("users")
      .select("phone")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    // Generic response prevents username enumeration.
    if (!profile?.phone) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });

    const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
    const { data, error } = await authClient.auth.signInWithPassword({ phone: profile.phone, password });
    if (error || !data.session) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });

    return new Response(JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      token_type: data.session.token_type,
    }), { status: 200, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
