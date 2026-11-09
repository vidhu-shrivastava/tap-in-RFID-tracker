# ============================================================================
# STRICT AI INSTRUCTIONS — READ THIS FIRST (GitHub Copilot / AI Chatbot)
# ============================================================================
#
# This file is the progress log for branch `branch-db-onboarding` ONLY.
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
# - **2026-10-12 21:15** — Files: `database/schema.sql`, `frontend/register.html`.
#   Built: members table + registration form fields. How it works: INSERT via Supabase.
# ============================================================================

# Progress — Database & Onboarding

**Name:** Jayati  
**Role:** MIS — Database Schema & Card Registration  
**Branch:** `branch-db-onboarding` (merged into `main`)  
**Owns:** `/database/schema.sql`, `frontend/register.html` (and this progress file only under docs)  
**Copilot tags:** `@docs/AI_CODING_SKILLS.md` `@docs/progress/db-onboarding.md`

---

## Status — DONE

Core schema (`members` / `events` / `attendance_logs`) and the branded `register.html` onboarding page shipped and merged. On `main`, register is account-first (Auth signup) with optional RFID bind via shared helpers; `rfid_uid` can be null until a card is bound (`database/phase2_nullable_rfid.sql`).

See root `README.md` for the full finished stack.

---

### 1. Automated AI Work Log (Timestamped by AI on each work session/push)

<!-- AI: append new bullets below. Do not delete older entries. -->

- *(No AI entries yet — first work session will add the first timestamped bullet here.)*
- **2026-10-19 01:01** — Files: `database/schema.sql`, `frontend/register.html`.
	Built: members/events/attendance tables, FK indexes, one-check-in-per-event constraint, five sample INSERT statements, and an enabled static registration form.
	How it works: UUID keys and foreign keys connect taps to seeded members and events; browser validation checks the form and displays a demo-only status without writing to Supabase.

- **2026-10-28 19:05** — Files: `frontend/register.html`.
	Built: Restyled the card registration page to match Tap-IN member UI (green/mint/teal light gradient, slate dark theme, logo mark, emerald cards/inputs, gradient submit button, theme toggle, visible field errors).
	How it works: Same Week-1 static form (full name, email, RFID hex + `preventDefault`); only Tailwind/classes and light validation messaging changed — no schema or Supabase writes.

- **2026-11-08 23:20** — Files: `docs/progress/db-onboarding.md`.
  Built: Marked Database & Onboarding log **DONE** after merge into finished `main`.
  How it works: Status banner points readers at schema + register outcomes without rewriting older bullets.

### 2. Member Plain-English Summary (Written by Human Only)

<!-- HUMAN ONLY — AI must NEVER write this section. -->

**Instructions:** Periodically read the AI Work Log above, then write a plain-English summary of what you built and how it works — in your own words. Do not copy AI bullets word-for-word.

*(Write your human summary below this line.)*
