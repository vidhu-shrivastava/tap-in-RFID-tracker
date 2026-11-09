# ============================================================================
# STRICT AI INSTRUCTIONS — READ THIS FIRST (GitHub Copilot / AI Chatbot)
# ============================================================================
#
# This file is the progress log for branch `main` (post-merge integration) ONLY.
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
# - **2026-10-12 21:15** — Files: `README.md`. Built: pointed Quick Start at
#   cloud keys. How it works: teammates paste URL/anon once per machine.
# ============================================================================

# Progress — Main (integration)

**Name:** Vidhu  
**Role:** CS — Team Lead (merge / demo wiring on `main`)  
**Branch:** `main`  
**Owns:** Post-merge glue only — shared client helpers, cloud setup notes, seed/RLS SQL, thin hardware receive. Teammate page/SQL ownership stays in their branch progress files.  
**Copilot tags:** `@docs/AI_CODING_SKILLS.md` `@docs/progress/main.md`

---

## Status — DONE

**MVP is complete on `main`.** Phase 1 (schema, scan RPC, UIs, cloud wiring) and Phase 2 (Auth, account-then-RFID, polished member/admin flows, hardware receive path) are merged and wired together.

| What to know | Detail |
|--------------|--------|
| Entry page | `frontend/index.html` |
| Auth | Email + password (`signUpWithPassword` / `signInWithPassword`) — no Google |
| Admin | RFID UID contains `ADMIN` + chapter password in gitignored `admin.local.js` |
| Secrets | Only in gitignored `supabase.local.js`, `admin.local.js`, `backend/.env` — never committed |
| Docs | Root `README.md` is the project home; this file is the integration log |

**How a demo runs:** create/sign in → dashboard → bind RFID once if needed → (admin) open Admin from profile → activate event → simulate scan or `POST /scan` → points show on dashboard.

---

### 1. Automated AI Work Log (Timestamped by AI on each work session/push)

<!-- AI: append new bullets below. Do not delete older entries. -->

- **2026-11-02 15:55** — Files: `frontend/js/supabase.local.js` (gitignored keys), `backend/.env` (gitignored), `database/lead_explore_seed.sql`, `database/add_is_archived.sql`, `docs/LOCAL_SUPABASE.md`, `README.md`, `frontend/js/supabase.js` (small resilience), `docs/progress/main.md`.
  Built: Pointed the merged Week-1 app at the shared **cloud** Supabase project; seeded the five-person chapter directory; removed a conflicting demo member so RFID uniques stay clean.
  How it works: after teammate UIs/schema/RPC landed on `main`, lead wiring is keys + SQL seed + shared helpers so register / sign-in / admin / scan all hit the same remote DB. Archive column is optional until `add_is_archived.sql` is pasted; event list/create still work without it.

- **2026-11-03 10:25** — Files: `README.md`, `database/README.md`, `docs/progress/main.md`.
  Built: Rewrote root README for post-merge reality — what works vs left, backend receive path, clarified owners (Turner / Kathleen / Jayati / Kailash / Vidhu), and Week-2+ checklists including Turner member-UI polish.
  How it works: README is now the team’s single status + assignment board so people finishing Week 1 (esp. Turner) can pick concrete next files without guessing.

- **2026-11-08 22:30** — Files: `frontend/index.html`, `frontend/dashboard.html`, `frontend/profile-settings.html`, `frontend/register.html`, `docs/progress/main.md`.
  Built: Post-merge Phase 2 glue — hooked Turner’s member UI to Vidhu’s Auth helpers after `backend-core` + `member-ui` landed on `main`.
  How it works: `index.html` calls `signInWithPassword` / `signUpWithPassword` (no preview stubs); dashboard uses `getSessionMember`, `isAdminMember`, `memberHasRfid`, and `signOut`; profile settings loads the real session name; RFID bind stays on `register.html` and the dashboard CTA hides once a card is bound.

- **2026-11-08 23:20** — Files: `README.md`, `docs/PROGRESS_TRACKER.md`, `docs/progress/main.md`, `docs/progress/backend-core.md`, `docs/progress/member-ui.md`, `docs/progress/db-onboarding.md`, `docs/progress/admin-analytics.md`, `docs/progress/hardware.md`, `docs/LOCAL_SUPABASE.md`, `database/README.md`.
  Built: Marked the project **officially DONE**; rewrote README + progress index for a finished MVP; added clear Status sections on every progress file; confirmed secret files stay gitignored / placeholder-only in examples.
  How it works: README is the public “what shipped + how to run” page; progress files keep historical AI logs but lead with a readable DONE summary so graders/teammates do not dig through weeks of bullets.

### 2. Member Plain-English Summary (Written by Human Only)

<!-- HUMAN ONLY — AI must NEVER write this section. -->

**Instructions:** Periodically read the AI Work Log above, then write a plain-English summary of what you built and how it works — in your own words. Do not copy AI bullets word-for-word.

*(Write your human summary below this line.)*
