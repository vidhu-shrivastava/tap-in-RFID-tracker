# GitHub Copilot Instructions — Tap-In RFID Attendance Tracker

These instructions are loaded automatically by GitHub Copilot in VS Code. Follow them on every suggestion and chat response.

## Tech Stack Constraints (NON-NEGOTIABLE)

- **Allowed:** Vanilla HTML5, Tailwind CSS via CDN, Vanilla JS, Supabase JS via CDN, standard Arduino C++ for UNO R4 WiFi (RC522 RFID, OLED, Buzzer).
- **Not allowed:** React / Vue / Svelte / Angular / Next.js, Tailwind build pipelines, Vite / Webpack / Parcel, TypeScript build steps, over-complicated abstractions.
- Keep all code **simple and heavily commented** so beginner developers can read and explain every line.

## Monorepo Layout

- `docs/` — shared guides (Lead) + `docs/progress/*.md` per-branch logs (merge-safe)
- `database/schema.sql` — Supabase PostgreSQL schema
- `frontend/` — `index.html`, `dashboard.html`, `register.html`, `admin.html`, `js/supabase.js`
- `hardware/tap_in_scanner/tap_in_scanner.ino` — Arduino sketch

## Branch Ownership (do not edit outside the member's lane)

| Branch | Role | Files |
|--------|------|-------|
| `branch-backend-core` | Vidhu (Lead) | `frontend/js/supabase.js`, shared docs, `docs/progress/backend-core.md`, backend logic |
| `branch-hardware` | Kathleen | `/hardware/`, `docs/progress/hardware.md` |
| `branch-member-ui` | Turner | `frontend/index.html`, `frontend/dashboard.html`, `docs/progress/member-ui.md` |
| `branch-db-onboarding` | Jayati/Kailash | `/database/schema.sql`, `frontend/register.html`, `docs/progress/db-onboarding.md` |
| `branch-admin-analytics` | Jayati/Kailash | `frontend/admin.html`, `docs/progress/admin-analytics.md` |

## Database Schema (Supabase PostgreSQL)

### `members`
- `id` (uuid PK), `full_name` (text), `email` (text unique), `rfid_uid` (text unique), `total_points` (int4 default 0)

### `events`
- `id` (uuid PK), `event_name` (text), `event_date` (date), `point_value` (int4), `is_active` (boolean default false)

### `attendance_logs`
- `id` (uuid PK), `member_id` (uuid FK → members.id), `event_id` (uuid FK → events.id), `scanned_at` (timestamptz default now())

Do not invent tables or columns outside this schema.

## Coding Style

1. Prefer clear, boring, readable code over clever abstractions.
2. Comment why and what in plain English.
3. Use Tailwind utility classes in HTML; avoid large custom CSS files unless necessary.
4. Shared Supabase setup belongs in `frontend/js/supabase.js`.
5. Hardware code targets Arduino UNO R4 WiFi + RC522 + OLED + buzzer — keep sketches modular and commented.
6. When asked for explanations, use simple terms suitable for first-year CS / MIS majors.

## Progress Tracker Rule (MANDATORY)

After completing code changes — or when a teammate is finishing a session / about to commit or push — **append** a timestamped (`YYYY-MM-DD HH:MM`) bullet to **that teammate’s own** `docs/progress/<branch-file>.md`. Do **not** write logs into `docs/PROGRESS_TRACKER.md` (index only). Do **not** edit another branch’s progress file.

Each entry must list:
1. Files modified/created
2. Features, UI elements, SQL queries, or hardware functions built
3. Brief technical explanation of how it works under the hood

- **NEVER** delete or overwrite past entries.
- **NEVER** write the "Member Plain-English Summary" (Human Only) section.

Full project rules live in `docs/AI_CODING_SKILLS.md`. Progress index: `docs/PROGRESS_TRACKER.md`. Per-branch logs: `docs/progress/`. Git workflow: `docs/GIT_AND_COPILOT_GUIDE.md`.

## Custom Skills Summary (see full text in docs/AI_CODING_SKILLS.md)

1. **Superpowers:** Clarify → Spec → Plan → Execute (small steps) → Review before big features.
2. **GSD:** Read real file state first; surgical edits only; tell the human to reset chat if context is rotting.
3. **Lazy Dev:** Prefer native JS / Arduino / Supabase CDN over new frameworks or micro-libraries.
4. **Architecture:** Vanilla pages + Supabase + Arduino — never Next.js/Flask/React/Framer unless Lead changes the docs.
5. **UI:** Clean Tailwind, loading/empty/error text; no blank flash states; no SaaS neon-glow defaults.
6. **DB hygiene:** Indexes on FKs; avoid locking migrations; no invented columns; watch N+1 in JS loops.
7. **SecOps:** RLS + no service-role in browser; parameterized Supabase calls; validate forms; fail closed; guard double-taps.
8. **Grill me / Council:** Use when asked — edge-case interrogation or 5-expert debate + Chairman consensus.
