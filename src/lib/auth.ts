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

function phoneToEmail(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `user_${digits}@aranchpass.internal`;
}

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
  if (data === "ceo") return "ceo";
  return "provider";
}

export async function loginPortal(identifier: string, password: string): Promise<PortalSession> {
  const cleanIdentifier = identifier.trim();

  // Instant developer bypass for testing
  if (demoEnabled()) {
    if (cleanIdentifier === "admin123" && password === "admin123") {
      return persistSession({ role: "ceo", username: "admin123", source: "demo" });
    }
    if (cleanIdentifier === "provider123" && password === "provider123") {
      return persistSession({ role: "provider", username: "provider123", source: "demo" });
    }
  }

  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    let signedIn = false;
    let lastError = "";

    const candidateEmails: string[] = [];

    if (cleanIdentifier.includes("@")) {
      candidateEmails.push(cleanIdentifier.toLowerCase());
    } else {
      const digits = cleanIdentifier.replace(/\D/g, "");
      if (digits.length >= 7) {
        candidateEmails.push(`user_${digits}@aranchpass.internal`);
        if (!digits.startsWith("91")) {
          candidateEmails.push(`user_91${digits}@aranchpass.internal`);
        } else {
          candidateEmails.push(`user_${digits.replace(/^91/, "")}@aranchpass.internal`);
        }
      }

      // Username RPC lookup
      try {
        const { data: rpcEmail } = await supabase.rpc("get_auth_email_by_username", { p_username: cleanIdentifier.toLowerCase() });
        if (rpcEmail && !candidateEmails.includes(rpcEmail)) candidateEmails.unshift(rpcEmail);
      } catch {
        // RPC fallback
      }

      // Direct users table lookup
      try {
        const { data: profile } = await supabase
          .from("users")
          .select("email, phone")
          .eq("username", cleanIdentifier.toLowerCase())
          .maybeSingle();

        if (profile?.email && !candidateEmails.includes(profile.email)) candidateEmails.unshift(profile.email);
        if (profile?.phone) {
          const mapped = phoneToEmail(profile.phone);
          if (!candidateEmails.includes(mapped)) candidateEmails.push(mapped);
        }
      } catch {
        // Table fallback
      }
    }

    // Try authenticating with candidate emails
    for (const email of candidateEmails) {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (!res.error && res.data.session) {
        signedIn = true;
        break;
      }
      if (res.error) lastError = res.error.message;
    }

    // Also try phone authentication directly if digits
    const isPhone = /^\+?[1-9]\d{7,14}$/.test(cleanIdentifier.replace(/[\s-]/g, ""));
    if (!signedIn && isPhone) {
      const phone = cleanIdentifier.replace(/[\s-]/g, "");
      const resPhone = await supabase.auth.signInWithPassword({ phone, password });
      if (!resPhone.error && resPhone.data.session) {
        signedIn = true;
      } else if (resPhone.error) {
        lastError = resPhone.error.message;
      }
    }

    if (signedIn) {
      try {
        const role = await resolveSupabaseRole();
        return persistSession({ role, username: cleanIdentifier, source: "supabase" });
      } catch {
        return persistSession({ role: "provider", username: cleanIdentifier, source: "supabase" });
      }
    }

    if (lastError && !demoEnabled()) {
      throw new Error(lastError);
    }
  }

  // Fallback to local demo users if Supabase was not connected
  if (demoEnabled()) {
    const hash = await sha256(password);
    const user = demoUsers().find(
      (item) => (item.username.toLowerCase() === cleanIdentifier.toLowerCase() || item.phone === cleanIdentifier) && item.passwordHash === hash,
    );
    if (user) return persistSession({ role: "provider", username: user.username, source: "demo" });
  }

  throw new Error("Invalid credentials. Please check your username/phone and password.");
}

export async function sendSignupOtp(phone: string) {
  const cleanPhone = phone.replace(/[\s-]/g, "");
  if (!/^\+?[1-9]\d{7,14}$/.test(cleanPhone)) throw new Error("Enter a valid phone number with country code.");

  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: cleanPhone });
      if (!error) return { demoOtp: undefined };
    } catch {
      // SMS gateway unconfigured, use fallback OTP
    }
  }

  return { demoOtp: DEMO_OTP };
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
    let authUser = null;

    // 1. Direct Supabase Auth user registration (Zero SMS provider required)
    const email = phoneToEmail(phone);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: {
        data: { phone, username },
      },
    });

    if (!signUpError && signUpData?.user) {
      authUser = signUpData.user;
    } else if (signUpError?.message?.toLowerCase().includes("already registered")) {
      const { data: signInData } = await supabase.auth.signInWithPassword({ email, password: input.password });
      if (signInData?.user) authUser = signInData.user;
    }

    // 2. Upsert real row into public.users in Supabase
    if (authUser) {
      await supabase.from("users").upsert({
        id: authUser.id,
        username,
        display_name: username,
        phone,
        email,
        city: input.location.city,
        district: input.location.district,
        state: input.location.state,
        pincode: input.location.pincode,
        post_office: input.location.postOffice || null,
        portal_role: "provider",
      });

      return persistSession({ role: "provider", username, source: "supabase" });
    }
  }

  // Local fallback if Supabase network fails
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
