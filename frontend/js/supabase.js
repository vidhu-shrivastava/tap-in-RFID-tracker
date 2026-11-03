/**
 * Tap-In — shared Supabase client helpers
 * Owner branch: branch-backend-core
 *
 * HOW HTML PAGES SHOULD LOAD THIS FILE
 * ------------------------------------
 *   <script type="module">
 *     import { supabase, handleRfidScan } from "./js/supabase.js";
 *   </script>
 *
 * SECRETS (do not put real keys in THIS file)
 * -------------------------------------------
 * 1. Copy supabase.local.js.example → supabase.local.js (gitignored)
 * 2. Put cloud Project URL + anon public key in supabase.local.js
 *    (Supabase → Project Settings → API). Do not use Docker / 127.0.0.1:54321.
 * Never use the service_role key in frontend code.
 *
 * Expected tables: members, events, attendance_logs
 * Scan RPC: handle_rfid_scan (see database/rpc_handle_scan.sql)
 *
 * MVP AUTH (no password column on members)
 * ----------------------------------------
 * Sign-in looks up a member by email and stores { id, email, full_name }
 * in sessionStorage. Pages import the session helpers below.
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

/** sessionStorage key for the signed-in member (tab-scoped MVP session). */
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
// Member session (MVP — email lookup, not Supabase Auth)
// ---------------------------------------------------------------------------

/**
 * Save a minimal member session after register / sign-in.
 * @param {{ id: string, email: string, full_name?: string }} member
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
    })
  );
}

/** @returns {{ id: string, email: string, full_name: string }|null} */
export function getMemberSession() {
  try {
    const raw = sessionStorage.getItem(MEMBER_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.id !== "string") return null;
    return parsed;
  } catch (error) {
    console.error("[tap-in] could not read member session:", error);
    return null;
  }
}

/** Clear the MVP member session (sign out). */
export function clearMemberSession() {
  sessionStorage.removeItem(MEMBER_SESSION_KEY);
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
    .select("id, full_name, email, rfid_uid, total_points")
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
    .select("id, full_name, email, rfid_uid, total_points")
    .eq("id", memberId)
    .maybeSingle();

  if (error) {
    console.error("[tap-in] getMemberById failed:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Insert a new member + RFID card (registration form).
 * @param {{ full_name: string, email: string, rfid_uid: string }} fields
 * @returns {Promise<{ data: object|null, error: Error|null }>}
 */
export async function registerMember(fields) {
  const full_name = String(fields.full_name || "").trim();
  const email = String(fields.email || "").trim().toLowerCase();
  const rfid_uid = String(fields.rfid_uid || "").trim().toUpperCase();

  if (!full_name || !email || !rfid_uid) {
    return {
      data: null,
      error: new Error("Full name, email, and RFID UID are required."),
    };
  }

  if (!/^[A-F0-9]+$/.test(rfid_uid)) {
    return {
      data: null,
      error: new Error("RFID UID must be hexadecimal (0-9 and A-F)."),
    };
  }

  const { data, error } = await supabase
    .from("members")
    .insert({ full_name, email, rfid_uid, total_points: 0 })
    .select("id, full_name, email, rfid_uid, total_points")
    .single();

  if (error) {
    console.error("[tap-in] registerMember failed:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * True when an RFID UID is admin-priority (substring "ADMIN", case-insensitive).
 * Regular hex UIDs stay on the normal member registration path.
 * @param {string} rfidUid
 * @returns {boolean}
 */
export function isAdminRfid(rfidUid) {
  return String(rfidUid || "")
    .toUpperCase()
    .includes("ADMIN");
}

/**
 * List all members (admin). Admin-priority UIDs sort first, then by name.
 * @returns {Promise<{ data: object[], error: Error|null }>}
 */
export async function listMembers() {
  const { data, error } = await supabase
    .from("members")
    .select("id, full_name, email, rfid_uid, total_points")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("[tap-in] listMembers failed:", error.message);
    return { data: [], error };
  }

  const rows = data || [];
  rows.sort((a, b) => {
    const aAdmin = isAdminRfid(a.rfid_uid) ? 0 : 1;
    const bAdmin = isAdminRfid(b.rfid_uid) ? 0 : 1;
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
 * Check-in counts per event for the admin chart (excludes archived when column exists).
 * @returns {Promise<{ data: { event_name: string, check_ins: number }[], error: Error|null }>}
 */
export async function listEventCheckInCounts() {
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
    event_name: ev.event_name,
    check_ins: Number(ev.attendance_logs?.[0]?.count ?? 0),
  }));

  return { data: rows, error: null };
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

console.log("[tap-in] supabase.js loaded — shared client ready.");
