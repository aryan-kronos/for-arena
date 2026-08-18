import { publicEnv } from "@/config/env";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export type PortalRole = "provider" | "ceo";
export type PortalSession = {
  role: PortalRole;
  username: string;
  source: "demo" | "supabase";
};

const SESSION_KEY = "aranch-pass-portal-session";
const USERS_KEY = "aranch-pass-demo-users";
const DEMO_OTP = "123456";

const demoEnabled = () => publicEnv.demoAuthEnabled;

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function persistSession(session: PortalSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getPortalSession(): PortalSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PortalSession) : null;
  } catch {
    return null;
  }
}

export async function logoutPortal() {
  sessionStorage.removeItem(SESSION_KEY);
  const supabase = getSupabaseBrowserClient();
  if (supabase) await supabase.auth.signOut();
}

type SignupLocation = { pincode: string; city: string; district: string; state: string; postOffice: string };
type DemoUser = { username: string; phone: string; passwordHash: string; role: "provider"; location?: SignupLocation };
function demoUsers(): DemoUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as DemoUser[];
  } catch {
    return [];
  }
}

async function resolveSupabaseRole(): Promise<PortalRole> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.rpc("get_my_portal_role");
  if (error) throw new Error(error.message);
  if (data !== "ceo" && data !== "provider") throw new Error("This account has no portal role.");
  return data;
}

export async function loginPortal(identifier: string, password: string): Promise<PortalSession> {
  const cleanIdentifier = identifier.trim();

  if (demoEnabled()) {
    if (cleanIdentifier === "admin123" && password === "admin123") {
      return persistSession({ role: "ceo", username: "admin123", source: "demo" });
    }
    if (cleanIdentifier === "provider123" && password === "provider123") {
      return persistSession({ role: "provider", username: "provider123", source: "demo" });
    }
    const hash = await sha256(password);
    const user = demoUsers().find(
      (item) => (item.username === cleanIdentifier || item.phone === cleanIdentifier) && item.passwordHash === hash,
    );
    if (user) return persistSession({ role: "provider", username: user.username, source: "demo" });
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Invalid credentials. Demo access is enabled only for the documented demo accounts.");

  const isPhone = /^\+?[1-9]\d{7,14}$/.test(cleanIdentifier.replace(/[\s-]/g, ""));
  if (isPhone) {
    const phone = cleanIdentifier.replace(/[\s-]/g, "");
    const { error } = await supabase.auth.signInWithPassword({ phone, password });
    if (error) throw new Error(error.message);
  } else {
    // Username login must be resolved server-side so a public lookup never leaks phone numbers.
    const { data, error } = await supabase.functions.invoke("username-login", {
      body: { username: cleanIdentifier, password },
    });
    if (error || !data?.access_token || !data?.refresh_token) {
      throw new Error(error?.message || "Username login failed.");
    }
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    if (sessionError) throw new Error(sessionError.message);
  }

  const role = await resolveSupabaseRole();
  return persistSession({ role, username: cleanIdentifier, source: "supabase" });
}

export async function sendSignupOtp(phone: string) {
  const cleanPhone = phone.replace(/[\s-]/g, "");
  if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) throw new Error("Enter a valid phone number with country code.");

  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: cleanPhone });
      if (!error) return { demoOtp: undefined };
      if (demoEnabled()) return { demoOtp: DEMO_OTP };
      throw new Error(error.message);
    } catch (err) {
      if (demoEnabled()) return { demoOtp: DEMO_OTP };
      throw err;
    }
  }

  if (demoEnabled()) return { demoOtp: DEMO_OTP };
  throw new Error("Signup is not connected yet.");
}

export async function completeSignup(input: {
  phone: string;
  username: string;
  otp: string;
  password: string;
  location: SignupLocation;
}): Promise<PortalSession> {
  const phone = input.phone.replace(/[\s-]/g, "");
  const username = input.username.trim().toLowerCase();
  if (!/^[a-z0-9_]{4,24}$/.test(username)) throw new Error("Username must be 4–24 characters using letters, numbers or underscore.");
  if (input.password.length < 8) throw new Error("Password must contain at least 8 characters.");
  if (!/^\d{6}$/.test(input.location.pincode) || !input.location.city || !input.location.state) {
    throw new Error("Add and verify the business city, state and six-digit PIN code.");
  }

  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({ phone, token: input.otp, type: "sms" });
      if (!error && data?.user) {
        const { error: passwordError } = await supabase.auth.updateUser({ password: input.password });
        if (passwordError) throw new Error(passwordError.message);
        await supabase.from("users").upsert({
          id: data.user.id,
          username,
          display_name: username,
          phone,
          city: input.location.city,
          district: input.location.district,
          state: input.location.state,
          pincode: input.location.pincode,
          post_office: input.location.postOffice || null,
        });
        return persistSession({ role: "provider", username, source: "supabase" });
      }
      if (!demoEnabled() && error) throw new Error(error.message);
    } catch (err) {
      if (!demoEnabled()) throw err;
    }
  }

  if (demoEnabled()) {
    if (input.otp !== DEMO_OTP) throw new Error("For demo mode, use OTP 123456.");
    const users = demoUsers();
    const existingIndex = users.findIndex((item) => item.username === username || item.phone === phone);
    const newUser = { username, phone, passwordHash: await sha256(input.password), role: "provider" as const, location: input.location };
    if (existingIndex >= 0) users[existingIndex] = newUser;
    else users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return persistSession({ role: "provider", username, source: "demo" });
  }

  throw new Error("Signup is not connected yet.");
}
