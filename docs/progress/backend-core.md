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

- **2026-10-26 20:25** — Files: `frontend/lead-explore.html` (created), `database/lead_explore_seed.sql` (created), `docs/progress/backend-core.md`.
  Built: Lead-only smoke-test page + SQL seed for a personal explore member (`vidhu.lead@tap-in.local` / `LEAD0001`) without editing teammate-owned HTML pages.
  How it works: seed grants anon MVP access and inserts the explore row/event; `lead-explore.html` pings Supabase, finds that member, and calls `handleRfidScan` so Week 2 planning can verify the backend while UI owners keep iterating on their branches.

- **2026-10-26 20:35** — Files: `supabase/` (init + migration + seed), `docs/LOCAL_SUPABASE.md`, `frontend/js/supabase.local.js.example`, `README.md`, `docs/progress/backend-core.md`.
  Built: local Supabase CLI project so schema/RPC/seed can run in Docker from the IDE instead of only the cloud SQL Editor.
  How it works: `npx supabase start` boots local API at `127.0.0.1:54321`; migrations mirror `/database/` SQL; `supabase.local.js` switches between cloud and local keys.

- **2026-11-02 12:20** — Files: `frontend/js/supabase.js`, `frontend/index.html`, `frontend/dashboard.html`, `frontend/register.html`, `frontend/admin.html`, `frontend/js/admin.local.js.example`, `.gitignore`, `supabase/seed.sql`, `docs/LOCAL_SUPABASE.md`, `README.md`, `frontend/lead-explore.html` (nav copy only).
  Built: Wired the merged Week-1 UIs into one localhost app — shared session/member/event/attendance helpers; Turner sign-in + live dashboard; Jayati register INSERT; functional admin (events activate, scan RPC, Chart.js) behind gitignored admin password; demo seed members/events; docs entry points at `index.html`.
  How it works: pages import helpers from `supabase.js`; MVP auth is email lookup + `sessionStorage`; register writes `members`; admin uses the same `handle_rfid_scan` RPC hardware will call; product flow no longer depends on the optional smoke page.

- **2026-11-02 12:55** — Files: `docs/LOCAL_SUPABASE.md`, `docs/HARDWARE_TAP_PATH.md` (created), `README.md`, `docs/AI_CODING_SKILLS.md`, `frontend/js/supabase.local.js.example`, `backend/` (`receive_scan.py`, README, `.env.example`), `.gitignore`, `hardware/tap_in_scanner/tap_in_scanner.ino` (header comments only).
  Built: Cloud-first setup docs (Docker optional appendix); monorepo `backend/` POST `/scan` receiver that calls `handle_rfid_scan`; hardware tap-path guide for admin simulate → Arduino → future KTP host.
  How it works: teammates paste cloud URL/anon into `supabase.local.js` without Docker; hardware can hit `http://127.0.0.1:8787/scan` so keys stay in `backend/.env` instead of firmware; verified local REST member lookup + RPC after `db reset`.

- **2026-11-02 15:15** — Files: `frontend/admin.html`, `frontend/js/supabase.js`, `supabase/seed.sql`, `supabase/migrations/20261102190000_events_is_archived.sql`, `database/schema.sql`, `database/lead_explore_seed.sql`, `frontend/lead-explore.html`, `docs/LOCAL_SUPABASE.md`, `docs/HARDWARE_TAP_PATH.md`.
  Built: Admin dashboard polish — team members directory (`@uga.edu`, Vidhu `ADMIN001` admin-priority), Lock→Exit, horizontal check-ins chart from per-event counts, Activate/Deactivate + Archive event actions.
  How it works: UIDs containing `ADMIN` sort/badge as admin; `is_archived` soft-hides finished events; `deactivateEvent` / `archiveEvent` helpers flip status without auto-picking another live event; chart uses nested `attendance_logs(count)` instead of re-aggregating a short log page.

- **2026-11-02 15:20** — Files: `docs/LOCAL_SUPABASE.md`, `README.md`, `docs/AI_CODING_SKILLS.md`, `frontend/js/supabase.local.js.example`, `frontend/js/supabase.js`, `backend/.env.example`, `database/lead_explore_seed.sql`.
  Built: Dropped Docker as a supported path — cloud Supabase only; team directory + `is_archived` live in cloud SQL seed; console warn if keys still point at localhost.
  How it works: setup docs / examples only show `https://….supabase.co`; `database/lead_explore_seed.sql` is the paste-once seed for RLS + members + sample events; `supabase/` CLI folder marked legacy/unused.

- **2026-11-08 17:15** — Files: `frontend/js/supabase.js`, `frontend/register.html`, `frontend/admin.html`, `database/phase2_nullable_rfid.sql` (created), `docs/LOCAL_SUPABASE.md`, `docs/HARDWARE_TAP_PATH.md`, `docs/AI_CODING_SKILLS.md`, `frontend/js/admin.local.js.example`, `backend/receive_scan.py`, `backend/README.md`, `docs/progress/backend-core.md`.
  Built: Phase 2 Backend Core — Supabase Auth email/password helpers (no Google); account-first signup then RFID bind; Turner-facing session/admin/RFID helpers; themed chapter-admin shell with vertical attendance chart (solid check-ins + hollow org-size bars + event date stamps + per-event dropdown); Exit → `dashboard.html`; stable `POST /scan` contract + demo checklist; RLS left open for Kathleen.
  How it works: `signUpWithPassword` / `signInWithPassword` create Auth users and ensure a `members` row linked by email (`rfid_uid` nullable after `phase2_nullable_rfid.sql`); `registerRfidForCurrentMember` binds a hex UID with duplicate/already-bound errors; `getSessionMember` / `isAdminMember` / `memberHasRfid` are what Turner imports; admin gate requires an ADMIN-UID member + quiet `admin.local.js` password; chart data from `listEventCheckInCounts` (includes `total_cards`).
  **Hand to Turner (`member-ui`):** import `signUpWithPassword`, `signInWithPassword`, `signOut`, `getSessionMember`, `isAdminMember`, `memberHasRfid`, `registerRfidForCurrentMember`; admin rule = RFID contains `ADMIN`; remove public “Exec Admin” / Google from `index.html`; profile menu Admin link only when `isAdminMember`; hide register-card once `memberHasRfid` is true.
  **Cloud one-time:** paste `database/phase2_nullable_rfid.sql`; for local Auth demos disable Confirm email in Supabase Auth settings.
  Confirmed local secrets exist and stay gitignored (`supabase.local.js`, `admin.local.js`, `backend/.env`); `PHASE_2_PLAN.md` remains gitignored / uncommitted.

- **2026-11-08 18:10** — Files: `frontend/js/supabase.js`, `frontend/register.html`, `frontend/admin.html`, `docs/progress/backend-core.md`.
  Built: Extra beginner/demo comments on Auth + RFID bind helpers and the register/admin page scripts (step numbers, Turner import notes, gate/chart explainers).
  How it works: comments spell out the Auth↔members email link, signup/bind panel switching, and admin unlock checks so the code is easier to demo out loud.

### 2. Member Plain-English Summary (Written by Human Only)

<!-- HUMAN ONLY — AI must NEVER write this section. -->

**Instructions:** Periodically read the AI Work Log above, then write a plain-English summary of what you built and how it works — in your own words. Do not copy AI bullets word-for-word.

*(Write your human summary below this line.)*
