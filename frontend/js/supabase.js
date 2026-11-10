/**
 * Tap-In — shared Supabase client helpers
 * Owner branch: backend-core (Vidhu / Team Lead)
 *
 * HOW HTML PAGES SHOULD LOAD THIS FILE
 * ------------------------------------
 *   <script type="module">
 *     import { supabase, signInWithPassword, getSessionMember } from "./js/supabase.js";
 *   </script>
 *
 * KEYS (do not put service_role / secrets in THIS file)
 * -----------------------------------------------------
 * Cloud Project URL + anon public key live in ./supabase.local.js
 * (anon is browser-safe and may be committed for hosting).
 * Never use the service_role key in frontend code.
 * Do not point supabase.local.js at Docker / 127.0.0.1:54321.
 *
 * Expected tables: members, events, attendance_logs
 * Scan RPC: handle_rfid_scan (see database/rpc_handle_scan.sql)
 *
 * PHASE 2 AUTH (password email via Supabase Auth — no Google / OAuth)
 * -------------------------------------------------------------------
 * Long-term path (Turner should wire index.html to these):
 *   signUpWithPassword / signInWithPassword / signOut / getSessionMember
 *
 * Members-row strategy = create-on-signup (linked by email):
 *   - Auth signup creates auth.users, then inserts a members row if missing
 *   - Seeded members (same email) are reused — we do NOT invent a second row
 *   - members.id stays the table PK (may differ from auth.users.id on seeds)
 *   - OneCard / RFID is optional at signup; bind later with registerRfidForCurrentMember
 *
 * LEGACY (email-only sessionStorage) — keep for Turner's migration week:
 *   getMemberByEmail + saveMemberSession / getMemberSession / clearMemberSession
 * Prefer Auth helpers for new UI. Do not add Google providers.
 *
 * ADMIN RULE (single source of truth for Turner’s profile menu):
 *   isAdminMember(member) → members.is_admin === true
 *   Legacy fallback: rfid_uid contains "ADMIN" (old demo cards like ADMIN001).
 *   Real UGA OneCard UIDs are hex (e.g. 04A1B2C3D4E5F6) and cannot encode ADMIN —
 *   run database/phase3_onecard_admin.sql and set is_admin in the DB.
 *   Optional extra gate on admin.html still uses gitignored admin.local.js.
 *
 * RLS: keep open (anon/authenticated) until Kathleen’s hardware → backend/
 * /scan path is proven end-to-end; tighten policies after that demo.
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase.local.js";

if (
  String(SUPABASE_URL || "").includes("127.0.0.1") ||
  String(SUPABASE_URL || "").includes("localhost") ||
  String(SUPABASE_URL || "").includes("YOUR_PROJECT_REF")
) {
  console.warn(
    "[tap-in] supabase.local.js must use a cloud Project URL (https://….supabase.co). Docker / localhost DB is not supported — see docs/LOCAL_SUPABASE.md"
  );
}

/** Shared browser client — import this from any page instead of re-init. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Columns every member fetch should request (includes OneCard-era is_admin). */
const MEMBER_COLUMNS =
  "id, full_name, email, rfid_uid, total_points, is_admin";

/** sessionStorage key for the signed-in member (tab-scoped MVP cache). */
const MEMBER_SESSION_KEY = "tapInMemberSession";

/**
 * Call the Postgres RPC that logs a tap and awards points.
 * @param {string} scannedUid - Hex UID string from the RC522 (e.g. "A1B2C3D4")
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function handleRfidScan(scannedUid) {
  const { data, error } = await supabase.rpc("handle_rfid_scan", {
    scanned_uid: scannedUid,
  });

  if (error) {
    console.error("[tap-in] handle_rfid_scan failed:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

// ---------------------------------------------------------------------------
// Member session cache (still used after Auth so Turner’s pages keep working)
// ---------------------------------------------------------------------------

/**
 * Save a minimal member session after register / sign-in.
 * @param {{ id: string, email: string, full_name?: string, rfid_uid?: string|null, total_points?: number, is_admin?: boolean }} member
 */
export function saveMemberSession(member) {
  if (!member || !member.id) {
    throw new Error("Cannot save session without a member id.");
  }
  sessionStorage.setItem(
    MEMBER_SESSION_KEY,
    JSON.stringify({
      id: member.id,
      email: member.email || "",
      full_name: member.full_name || "",
      rfid_uid: member.rfid_uid ?? null,
      total_points: Number(member.total_points ?? 0),
      is_admin: Boolean(member.is_admin),
    })
  );
}

/** @returns {{ id: string, email: string, full_name: string, rfid_uid: string|null, total_points: number, is_admin: boolean }|null} */
export function getMemberSession() {
  try {
    const raw = sessionStorage.getItem(MEMBER_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.id !== "string") return null;
    return {
      id: parsed.id,
      email: parsed.email || "",
      full_name: parsed.full_name || "",
      rfid_uid: parsed.rfid_uid ?? null,
      total_points: Number(parsed.total_points ?? 0),
      is_admin: Boolean(parsed.is_admin),
    };
  } catch (error) {
    console.error("[tap-in] could not read member session:", error);
    return null;
  }
}

/** Clear the MVP member session cache (does not call Supabase Auth by itself). */
export function clearMemberSession() {
  sessionStorage.removeItem(MEMBER_SESSION_KEY);
}

// ---------------------------------------------------------------------------
// Admin / OneCard product helpers (Turner imports these)
// ---------------------------------------------------------------------------
// Demo one-liner: "Admin = members.is_admin. Already have a OneCard? memberHasRfid."

/**
 * Legacy helper: true when a UID string contains "ADMIN" (old demo cards).
 * Prefer isAdminMember() — real OneCard hex UIDs never contain ADMIN.
 * @param {string|null|undefined} rfidUid
 * @returns {boolean}
 */
export function isAdminRfid(rfidUid) {
  return String(rfidUid || "")
    .toUpperCase()
    .includes("ADMIN");
}

/**
 * Admin access rule for profile menus / gates.
 * True when members.is_admin is set, or legacy UID still contains "ADMIN".
 * @param {{ rfid_uid?: string|null, is_admin?: boolean }|null|undefined} member
 * @returns {boolean}
 */
export function isAdminMember(member) {
  if (!member) return false;
  if (member.is_admin === true) return true;
  return isAdminRfid(member.rfid_uid);
}

/**
 * True when the member already has a bound OneCard / RFID UID.
 * Turner: hide “Register card” on the dashboard when this returns true.
 * @param {{ rfid_uid?: string|null }|null|undefined} member
 * @returns {boolean}
 */
export function memberHasRfid(member) {
  const uid = String(member?.rfid_uid || "").trim();
  return uid.length > 0;
}

/**
 * Privacy mask for displaying OneCard IDs in the UI.
 * Full UID stays in the DB and is still used for taps / bind — only the
 * rendered string is redacted (e.g. 04A1B2C3D4E5F6 → **********E5F6).
 * Legacy ADMIN* UIDs are shown in full (not masked).
 * @param {string|null|undefined} uid
 * @returns {string}
 */
export function maskOneCardUid(uid) {
  const s = String(uid || "")
    .trim()
    .toUpperCase();
  if (!s) return "";
  // Chapter admin demo cards stay visible.
  if (s.includes("ADMIN")) return s;
  if (s.length <= 4) return s;
  // OneCards: hide everything except the last 4 characters.
  return "*".repeat(s.length - 4) + s.slice(-4);
}

/**
 * Clean up a typed/scanned UID for OneCards + blank RFID tags.
 * Strips spaces/colons/dashes, uppercases, requires hex of length 8 / 14 / 20
 * (4-byte, 7-byte OneCard, or 10-byte UIDs from the RC522).
 * @param {string} rawUid
 * @returns {{ uid: string|null, error: Error|null }}
 */
function normalizeRfidUid(rawUid) {
  const uid = String(rawUid || "")
    .trim()
    .toUpperCase()
    .replace(/[\s:.\-]/g, "");
  if (!uid) {
    return { uid: null, error: new Error("OneCard UID is required.") };
  }
  if (!/^[A-F0-9]+$/.test(uid)) {
    return {
      uid: null,
      error: new Error("OneCard UID must be hexadecimal (0-9 and A-F)."),
    };
  }
  // Captured UGA OneCards are 7-byte (14 hex). Also allow 4-byte / 10-byte tags.
  if (![8, 14, 20].includes(uid.length)) {
    return {
      uid: null,
      error: new Error(
        "OneCard UID should be 8, 14, or 20 hex characters (example: 04A1B2C3D4E5F6)."
      ),
    };
  }
  return { uid, error: null };
}

// ---------------------------------------------------------------------------
// Supabase Auth — sign up / sign in / sign out / session member
// ---------------------------------------------------------------------------
// Two systems stay in sync:
//   1) auth.users  → password login (Supabase Auth, no Google)
//   2) members     → points / RFID / attendance (our app table)
// We link them by email. Seeded teammates keep their existing members row.

/**
 * Make sure a `members` row exists for this email (create-on-signup).
 * - Email already in members (seed) → reuse that row.
 * - Brand new email → insert with rfid_uid = null (card comes later).
 * @param {{ email: string, full_name?: string }} fields
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
async function ensureMemberRowForEmail(fields) {
  const email = String(fields.email || "").trim().toLowerCase();
  const full_name = String(fields.full_name || "").trim();

  if (!email) {
    return { data: null, error: new Error("Email is required.") };
  }

  // Step 1: look up existing member by email.
  const existing = await getMemberByEmail(email);
  if (existing.error) return existing;
  if (existing.data) {
    // Rare: fill in a blank name if Auth provided one.
    if (full_name && !existing.data.full_name) {
      const { data, error } = await supabase
        .from("members")
        .update({ full_name })
        .eq("id", existing.data.id)
        .select(MEMBER_COLUMNS)
        .single();
      if (error) {
        console.error("[tap-in] ensureMemberRow name update failed:", error.message);
        return { data: existing.data, error: null };
      }
      return { data, error: null };
    }
    return { data: existing.data, error: null };
  }

  if (!full_name) {
    return {
      data: null,
      error: new Error("Full name is required to create a member account."),
    };
  }

  // Step 2: brand-new email → insert member WITHOUT a card yet.
  // Needs database/phase2_nullable_rfid.sql so rfid_uid can be NULL.
  const { data, error } = await supabase
    .from("members")
    .insert({ full_name, email, rfid_uid: null, total_points: 0 })
    .select(MEMBER_COLUMNS)
    .single();

  if (error) {
    console.error("[tap-in] ensureMemberRow insert failed:", error.message);
    // Cloud DB still has NOT NULL on rfid_uid → tell the teammate what SQL to paste.
    if (/null value|rfid_uid/i.test(error.message || "")) {
      return {
        data: null,
        error: new Error(
          "Could not create member without RFID. Paste database/phase2_nullable_rfid.sql in the cloud SQL Editor, then try again."
        ),
      };
    }
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Create a password account (Supabase Auth) + matching members row.
 * Flow: validate → auth.signUp → ensure members row → cache session locally.
 * No Google / OAuth. For local demos, turn OFF “Confirm email” in Supabase Auth
 * so this returns a live session right away.
 *
 * @param {{ email: string, password: string, full_name: string }} fields
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function signUpWithPassword(fields) {
  const email = String(fields.email || "").trim().toLowerCase();
  const password = String(fields.password || "");
  const full_name = String(fields.full_name || "").trim();

  if (!email || !password || !full_name) {
    return {
      data: null,
      error: new Error("Full name, email, and password are required."),
    };
  }
  if (password.length < 6) {
    return {
      data: null,
      error: new Error("Password must be at least 6 characters."),
    };
  }

  // 1) Create the Auth user (password lives in Supabase Auth, not members).
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  });

  if (authError) {
    console.error("[tap-in] signUpWithPassword Auth failed:", authError.message);
    return { data: null, error: authError };
  }

  // 2) Mirror into our members table (points / RFID live here).
  const { data: member, error: memberError } = await ensureMemberRowForEmail({
    email,
    full_name,
  });
  if (memberError) return { data: null, error: memberError };

  // 3) Cache a small copy in sessionStorage so older pages keep working.
  saveMemberSession(member);

  // Confirm-email ON → Auth has no session yet; member row still exists.
  if (!authData.session) {
    return {
      data: member,
      error: new Error(
        "Account created. Check your email to confirm, then sign in. (For local demos: Supabase → Authentication → Providers → Email → disable Confirm email.)"
      ),
    };
  }

  return { data: member, error: null };
}

/**
 * Sign in with email + password, then load the members row for the UI.
 * Flow: auth.signInWithPassword → find/create members row → saveMemberSession.
 * @param {{ email: string, password: string }} fields
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function signInWithPassword(fields) {
  const email = String(fields.email || "").trim().toLowerCase();
  const password = String(fields.password || "");

  if (!email || !password) {
    return {
      data: null,
      error: new Error("Email and password are required."),
    };
  }

  // Ask Supabase Auth to verify the password.
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("[tap-in] signInWithPassword failed:", authError.message);
    return { data: null, error: authError };
  }

  // Auth OK → load our app profile (points, RFID, name).
  const { data: member, error: memberError } = await ensureMemberRowForEmail({
    email,
  });
  if (memberError) return { data: null, error: memberError };
  if (!member) {
    return {
      data: null,
      error: new Error(
        "Signed in, but no members row exists for that email. Use sign up first."
      ),
    };
  }

  saveMemberSession(member);
  return { data: member, error: null };
}

/**
 * Sign out: wipe local cache first, then tell Supabase Auth to end the session.
 * @returns {Promise<{ error: Error|null }>}
 */
export async function signOut() {
  clearMemberSession();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("[tap-in] signOut failed:", error.message);
    return { error };
  }
  return { error: null };
}

/**
 * “Who is logged in right now?” — preferred helper for Turner’s pages.
 * 1) If Supabase Auth has a session → look up members by that email.
 * 2) Else fall back to the old sessionStorage cache (email-only MVP).
 *
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function getSessionMember() {
  const { data: authWrap, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.error("[tap-in] getSessionMember Auth failed:", authError.message);
    return { data: null, error: authError };
  }

  const session = authWrap?.session;
  if (session?.user?.email) {
    const { data: member, error } = await ensureMemberRowForEmail({
      email: session.user.email,
      full_name: session.user.user_metadata?.full_name || "",
    });
    if (error) return { data: null, error };
    if (member) saveMemberSession(member);
    return { data: member, error: null };
  }

  // Legacy fallback — email-only MVP cache (Turner can migrate off this later).
  const cached = getMemberSession();
  if (!cached) return { data: null, error: null };

  const fresh = await getMemberById(cached.id);
  if (fresh.data) {
    saveMemberSession(fresh.data);
    return { data: fresh.data, error: null };
  }
  return { data: cached, error: fresh.error };
}

/**
 * Bind an RFID UID to the currently signed-in member (dashboard / register page).
 * Guards: must be signed in, must not already have a card, UID must be unique.
 *
 * @param {string} rawUid
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function registerRfidForCurrentMember(rawUid) {
  // 1) Validate hex format.
  const { uid, error: uidError } = normalizeRfidUid(rawUid);
  if (uidError) return { data: null, error: uidError };

  // 2) Need a signed-in member.
  const { data: member, error: sessionError } = await getSessionMember();
  if (sessionError) return { data: null, error: sessionError };
  if (!member) {
    return {
      data: null,
      error: new Error("Sign in before binding an RFID card."),
    };
  }

  // 3) One card per account (MVP).
  if (memberHasRfid(member)) {
    return {
      data: null,
      error: new Error(
        "This account already has an RFID card bound. Ask an admin if you need to change it."
      ),
    };
  }

  // 4) Another person already owns this UID?
  const { data: taken, error: takenError } = await supabase
    .from("members")
    .select("id, email")
    .ilike("rfid_uid", uid)
    .maybeSingle();

  if (takenError) {
    console.error("[tap-in] registerRfid duplicate check failed:", takenError.message);
    return { data: null, error: takenError };
  }
  if (taken && taken.id !== member.id) {
    return {
      data: null,
      error: new Error("That RFID UID is already registered to another member."),
    };
  }

  // 5) Write the UID onto this member’s row.
  const { data, error } = await supabase
    .from("members")
    .update({ rfid_uid: uid })
    .eq("id", member.id)
    .select(MEMBER_COLUMNS)
    .single();

  if (error) {
    console.error("[tap-in] registerRfidForCurrentMember failed:", error.message);
    const msg = error.message || "";
    if (/duplicate|unique/i.test(msg)) {
      return {
        data: null,
        error: new Error("That RFID UID is already registered to another member."),
      };
    }
    return { data: null, error };
  }

  saveMemberSession(data);
  return { data, error: null };
}

/**
 * How many members already have a card? Used as the hollow “org size” bar on admin chart.
 * @returns {Promise<{ data: number, error: Error|null }>}
 */
export async function countRegisteredRfidCards() {
  const { count, error } = await supabase
    .from("members")
    .select("id", { count: "exact", head: true })
    .not("rfid_uid", "is", null);

  if (error) {
    console.error("[tap-in] countRegisteredRfidCards failed:", error.message);
    return { data: 0, error };
  }
  return { data: Number(count ?? 0), error: null };
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

/**
 * Look up one member by email (case-insensitive trim).
 * @param {string} email
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function getMemberByEmail(email) {
  const normalized = String(email || "").trim().toLowerCase();
  if (!normalized) {
    return { data: null, error: new Error("Email is required.") };
  }

  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_COLUMNS)
    .ilike("email", normalized)
    .maybeSingle();

  if (error) {
    console.error("[tap-in] getMemberByEmail failed:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Load one member by primary key.
 * @param {string} memberId
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function getMemberById(memberId) {
  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_COLUMNS)
    .eq("id", memberId)
    .maybeSingle();

  if (error) {
    console.error("[tap-in] getMemberById failed:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Legacy: insert a new member + RFID in one step (old register.html path).
 * Prefer signUpWithPassword + registerRfidForCurrentMember for Phase 2.
 * @param {{ full_name: string, email: string, rfid_uid: string }} fields
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function registerMember(fields) {
  const full_name = String(fields.full_name || "").trim();
  const email = String(fields.email || "").trim().toLowerCase();
  const { uid: rfid_uid, error: uidError } = normalizeRfidUid(fields.rfid_uid);

  if (!full_name || !email || uidError) {
    return {
      data: null,
      error: uidError || new Error("Full name, email, and RFID UID are required."),
    };
  }

  const { data, error } = await supabase
    .from("members")
    .insert({ full_name, email, rfid_uid, total_points: 0 })
    .select(MEMBER_COLUMNS)
    .single();

  if (error) {
    console.error("[tap-in] registerMember failed:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * List all members (admin). Admin-priority UIDs sort first, then by name.
 * @returns {Promise<{ data: object[], error: Error|null }>}
 */
export async function listMembers() {
  const { data, error } = await supabase
    .from("members")
    .select(MEMBER_COLUMNS)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[tap-in] listMembers failed:", error.message);
    return { data: [], error };
  }

  const rows = data || [];
  rows.sort((a, b) => {
    const aAdmin = isAdminMember(a) ? 0 : 1;
    const bAdmin = isAdminMember(b) ? 0 : 1;
    if (aAdmin !== bAdmin) return aAdmin - bAdmin;
    return String(a.full_name || "").localeCompare(String(b.full_name || ""));
  });

  return { data: rows, error: null };
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

/**
 * Attendance rows for one member, with nested event name + points.
 * @param {string} memberId
 * @returns {Promise<{ data: object[], error: Error|null }>}
 */
export async function getMemberAttendance(memberId) {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select(
      "id, scanned_at, event_id, events ( event_name, event_date, point_value )"
    )
    .eq("member_id", memberId)
    .order("scanned_at", { ascending: false });

  if (error) {
    console.error("[tap-in] getMemberAttendance failed:", error.message);
    return { data: [], error };
  }
  return { data: data || [], error: null };
}

/**
 * Recent attendance across all members (admin table + charts).
 * @param {number} [limit=25]
 * @returns {Promise<{ data: object[], error: Error|null }>}
 */
export async function listRecentAttendance(limit = 25) {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select(
      "id, scanned_at, members ( full_name, email ), events ( event_name, point_value )"
    )
    .order("scanned_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[tap-in] listRecentAttendance failed:", error.message);
    return { data: [], error };
  }
  return { data: data || [], error: null };
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function missingArchivedColumn(error) {
  return /is_archived/i.test(String(error?.message || ""));
}

function withDefaultArchived(rows) {
  return (rows || []).map((ev) => ({
    ...ev,
    is_archived: Boolean(ev.is_archived),
  }));
}

/**
 * List all events (admin), active first, then live (non-archived), then archived.
 * Falls back if cloud DB has not applied `is_archived` yet.
 * @returns {Promise<{ data: object[], error: Error|null }>}
 */
export async function listEvents() {
  let { data, error } = await supabase
    .from("events")
    .select("id, event_name, event_date, point_value, is_active, is_archived")
    .order("is_active", { ascending: false })
    .order("event_date", { ascending: false });

  if (error && missingArchivedColumn(error)) {
    ({ data, error } = await supabase
      .from("events")
      .select("id, event_name, event_date, point_value, is_active")
      .order("is_active", { ascending: false })
      .order("event_date", { ascending: false }));
  }

  if (error) {
    console.error("[tap-in] listEvents failed:", error.message);
    return { data: [], error };
  }

  const rows = withDefaultArchived(data);
  rows.sort((a, b) => {
    const aRank = a.is_active ? 0 : a.is_archived ? 2 : 1;
    const bRank = b.is_active ? 0 : b.is_archived ? 2 : 1;
    if (aRank !== bRank) return aRank - bRank;
    return String(b.event_date || "").localeCompare(String(a.event_date || ""));
  });

  return { data: rows, error: null };
}

/**
 * Per-event check-in counts for the admin chart.
 * Each row has: check_ins (solid bar) + total_cards (hollow org-size bar) + event_date.
 * @returns {Promise<{ data: { event_id: string, event_name: string, event_date: string, check_ins: number, total_cards: number }[], error: Error|null }>}
 */
export async function listEventCheckInCounts() {
  // Same org-size number is attached to every event bar for comparison.
  const cardsResult = await countRegisteredRfidCards();
  const total_cards = cardsResult.data;

  let { data, error } = await supabase
    .from("events")
    .select("id, event_name, event_date, is_archived, attendance_logs(count)")
    .eq("is_archived", false)
    .order("event_date", { ascending: true });

  if (error && missingArchivedColumn(error)) {
    ({ data, error } = await supabase
      .from("events")
      .select("id, event_name, event_date, attendance_logs(count)")
      .order("event_date", { ascending: true }));
  }

  if (error) {
    console.error("[tap-in] listEventCheckInCounts failed:", error.message);
    return { data: [], error };
  }

  const rows = (data || []).map((ev) => ({
    event_id: ev.id,
    event_name: ev.event_name,
    event_date: ev.event_date,
    check_ins: Number(ev.attendance_logs?.[0]?.count ?? 0),
    total_cards,
  }));

  return { data: rows, error: cardsResult.error || null };
}

/**
 * Create an inactive event (activate separately so only one is live).
 * @param {{ event_name: string, event_date: string, point_value: number|string }} fields
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function createEvent(fields) {
  const event_name = String(fields.event_name || "").trim();
  const event_date = String(fields.event_date || "").trim();
  const point_value = Number(fields.point_value);

  if (!event_name || !event_date || !Number.isFinite(point_value) || point_value < 1) {
    return {
      data: null,
      error: new Error("Event needs a name, date, and point value >= 1."),
    };
  }

  let { data, error } = await supabase
    .from("events")
    .insert({
      event_name,
      event_date,
      point_value,
      is_active: false,
      is_archived: false,
    })
    .select("id, event_name, event_date, point_value, is_active, is_archived")
    .single();

  if (error && missingArchivedColumn(error)) {
    ({ data, error } = await supabase
      .from("events")
      .insert({
        event_name,
        event_date,
        point_value,
        is_active: false,
      })
      .select("id, event_name, event_date, point_value, is_active")
      .single());
  }

  if (error) {
    console.error("[tap-in] createEvent failed:", error.message);
    return { data: null, error };
  }
  return { data: withDefaultArchived([data])[0], error: null };
}

/**
 * Make exactly one event active (deactivate all others first).
 * Matches handle_rfid_scan's "exactly one active event" rule.
 * @param {string} eventId
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function setActiveEvent(eventId) {
  if (!eventId) {
    return { data: null, error: new Error("eventId is required.") };
  }

  // Step 1: turn every event off so we never leave two active.
  const { error: clearError } = await supabase
    .from("events")
    .update({ is_active: false })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (clearError) {
    console.error("[tap-in] setActiveEvent clear failed:", clearError.message);
    return { data: null, error: clearError };
  }

  // Step 2: activate the chosen event (and clear archive if column exists).
  let { data, error } = await supabase
    .from("events")
    .update({ is_active: true, is_archived: false })
    .eq("id", eventId)
    .select("id, event_name, event_date, point_value, is_active, is_archived")
    .single();

  if (error && missingArchivedColumn(error)) {
    ({ data, error } = await supabase
      .from("events")
      .update({ is_active: true })
      .eq("id", eventId)
      .select("id, event_name, event_date, point_value, is_active")
      .single());
  }

  if (error) {
    console.error("[tap-in] setActiveEvent activate failed:", error.message);
    return { data: null, error };
  }
  return { data: withDefaultArchived([data])[0], error: null };
}

/**
 * Turn off a single active event (no other event is auto-activated).
 * @param {string} eventId
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function deactivateEvent(eventId) {
  if (!eventId) {
    return { data: null, error: new Error("eventId is required.") };
  }

  let { data, error } = await supabase
    .from("events")
    .update({ is_active: false })
    .eq("id", eventId)
    .select("id, event_name, event_date, point_value, is_active, is_archived")
    .single();

  if (error && missingArchivedColumn(error)) {
    ({ data, error } = await supabase
      .from("events")
      .update({ is_active: false })
      .eq("id", eventId)
      .select("id, event_name, event_date, point_value, is_active")
      .single());
  }

  if (error) {
    console.error("[tap-in] deactivateEvent failed:", error.message);
    return { data: null, error };
  }
  return { data: withDefaultArchived([data])[0], error: null };
}

/**
 * Archive a finished event (also deactivates it).
 * Requires `events.is_archived` (see database/add_is_archived.sql).
 * @param {string} eventId
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function archiveEvent(eventId) {
  if (!eventId) {
    return { data: null, error: new Error("eventId is required.") };
  }

  const { data, error } = await supabase
    .from("events")
    .update({ is_active: false, is_archived: true })
    .eq("id", eventId)
    .select("id, event_name, event_date, point_value, is_active, is_archived")
    .single();

  if (error) {
    console.error("[tap-in] archiveEvent failed:", error.message);
    if (missingArchivedColumn(error)) {
      return {
        data: null,
        error: new Error(
          "Archive needs events.is_archived — paste database/add_is_archived.sql in the cloud SQL Editor."
        ),
      };
    }
    return { data: null, error };
  }
  return { data, error: null };
}

console.log("[tap-in] supabase.js loaded — Auth + shared client ready.");
