# ============================================================================
# STRICT AI INSTRUCTIONS — READ THIS FIRST (GitHub Copilot / AI Chatbot)
# ============================================================================
#
# This file is the progress log for branch `branch-backend-core` ONLY.
# Append timestamped bullets here. NEVER edit other files under docs/progress/.
#
# WHEN THIS TEAMMATE FINISHES A SESSION OR IS READY TO COMMIT / PUSH:
# 1. APPEND a timestamped entry (YYYY-MM-DD HH:MM) under the AI Work Log.
# 2. Each bullet MUST list: (1) files modified/created, (2) features built,
#    (3) brief under-the-hood explanation.
# 3. NEVER delete, overwrite, or reorder past AI log entries.
# 4. NEVER write the "Member Plain-English Summary" — humans only.
# 5. Newest entries go at the BOTTOM of the AI Work Log.
#
# Example:
# - **2026-10-12 21:15** — Files: `frontend/js/supabase.js`. Built: shared
#   createClient helper. How it works: loads CDN client once and exports helpers.
# ============================================================================

# Progress — Backend / Lead

**Name:** Vidhu  
**Role:** CS 2nd Year — Backend Integrator & Team Lead  
**Branch:** `branch-backend-core`  
**Owns:** `frontend/js/supabase.js`, shared docs guides (not other `docs/progress/*` files), backend logic  
**Copilot tags:** `@docs/AI_CODING_SKILLS.md` `@docs/progress/backend-core.md`

---

### 1. Automated AI Work Log (Timestamped by AI on each work session/push)

<!-- AI: append new bullets below. Do not delete older entries. -->

- **2026-10-15 12:25** — Files: `database/rpc_handle_scan.sql` (created), `frontend/js/supabase.js`.
  Built: `handle_rfid_scan(scanned_uid TEXT)` RPC (member lookup → exactly-one active event → duplicate guard → `attendance_logs` insert → `total_points` increment + JSONB status payload) and shared Supabase JS client init + `handleRfidScan` helper (CDN ESM, URL/anon placeholders only).
  How it works: hardware/frontend call one DB function as the scan entrypoint; pages `import { supabase, handleRfidScan } from "./js/supabase.js"` instead of duplicating `createClient`.

- **2026-10-15 13:58** — Files: `database/schema.sql`, `.gitignore` (created), `frontend/js/supabase.local.js.example` (created), `frontend/js/supabase.js`, `docs/progress/backend-core.md`.
  Built: live Supabase tables from schema; deployed + smoke-tested `handle_rfid_scan` (`checked_in` then `already_checked_in`); public-repo secret pattern — keys live only in gitignored `supabase.local.js`, tracked `supabase.js` imports that file and keeps placeholders out of Git.
  How it works: teammates copy the `.example` → local keys file; browser loads `supabase.js` which pulls URL/anon from the ignored local module so the public GitHub repo never gets project credentials.

### 2. Member Plain-English Summary (Written by Human Only)

<!-- HUMAN ONLY — AI must NEVER write this section. -->

**Instructions:** Periodically read the AI Work Log above, then write a plain-English summary of what you built and how it works — in your own words. Do not copy AI bullets word-for-word.

*(Write your human summary below this line.)*
