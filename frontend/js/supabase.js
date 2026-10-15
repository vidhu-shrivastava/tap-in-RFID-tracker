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
 * 2. Put Project URL + anon public key in supabase.local.js
 *    (Supabase → Project Settings → API)
 * Never use the service_role key in frontend code.
 *
 * Expected tables: members, events, attendance_logs
 * Scan RPC: handle_rfid_scan (see database/rpc_handle_scan.sql)
 */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase.local.js";

/** Shared browser client — import this from any page instead of re-init. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

console.log("[tap-in] supabase.js loaded — shared client ready.");
