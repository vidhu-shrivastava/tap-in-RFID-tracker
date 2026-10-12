# Tap-In RFID Attendance Tracker

University engineering-fraternity SWE MVP: members tap an RFID card at events, attendance is logged in Supabase, and points show up on simple web dashboards.

**Status:** `main` is the shared scaffold (docs + empty/placeholder files). Feature work happens on per-person branches, then merges back into `main`.

---

## What it does

1. **Hardware** scans an RFID card (Arduino UNO R4 WiFi + RC522 + OLED + buzzer).
2. **Database** stores members, events, and attendance logs (Supabase PostgreSQL).
3. **Web UI** lets members register cards / see points, and execs manage events / analytics.

---

## Tech stack (intentionally simple)

| Layer | Choice |
|-------|--------|
| Frontend | Vanilla HTML5, Tailwind CSS via CDN, Vanilla JS |
| Backend / data | Supabase (PostgreSQL + JS client via CDN) |
| Hardware | Arduino C++ on UNO R4 WiFi |
| Analytics | Chart.js CDN and/or Retool (admin) |
| Tooling | VS Code + GitHub Copilot (no React, no bundlers, no Flask/Next) |

Full AI/coding rules: [`docs/AI_CODING_SKILLS.md`](docs/AI_CODING_SKILLS.md)  
Beginner Git + Copilot guide: [`docs/GIT_AND_COPILOT_GUIDE.md`](docs/GIT_AND_COPILOT_GUIDE.md)

---

## Repo layout

```text
/
├── docs/                  # Guides + per-branch progress logs
├── database/schema.sql    # Supabase schema
├── frontend/              # HTML pages + js/supabase.js
└── hardware/tap_in_scanner/   # Arduino sketch
```

Progress logs are **separate files per branch** (`docs/progress/*.md`) so parallel work does not conflict when merging into `main`. Index: [`docs/PROGRESS_TRACKER.md`](docs/PROGRESS_TRACKER.md).

---

## Team branches & ownership

| Branch | Owner | Owns |
|--------|--------|------|
| `branch-backend-core` | Vidhu (Lead) | `frontend/js/supabase.js`, shared docs, backend integration |
| `branch-hardware` | Kathleen | `/hardware/` |
| `branch-member-ui` | Turner | `frontend/index.html`, `frontend/dashboard.html` |
| `branch-db-onboarding` | Jayati / Kailash | `database/schema.sql`, `frontend/register.html` |
| `branch-admin-analytics` | Jayati / Kailash | `frontend/admin.html` |

**Rule:** Stay on your branch. Never push to `main`. Only edit your assigned files (+ your own `docs/progress/<file>.md`).

---

## Database (MVP schema)

- **`members`** — `id`, `full_name`, `email`, `rfid_uid`, `total_points`
- **`events`** — `id`, `event_name`, `event_date`, `point_value`, `is_active`
- **`attendance_logs`** — `id`, `member_id`, `event_id`, `scanned_at`

Details and constraints live in [`docs/AI_CODING_SKILLS.md`](docs/AI_CODING_SKILLS.md) and [`database/schema.sql`](database/schema.sql).

---

## Quick start (teammates)

```bash
git clone <repo-url>
cd tap-in-RFID-tracker
git checkout <your-branch-name>   # e.g. branch-member-ui
git branch                        # confirm * is on YOUR branch
```

Open pages under `frontend/` in a browser. Wire Supabase keys in `frontend/js/supabase.js` (never commit the service-role key).

When prompting Copilot, always tag:

1. `@docs/AI_CODING_SKILLS.md`
2. Your `@docs/progress/<your-file>.md`
3. The file you are editing

---

## For reviewers (e.g. Andrew)

`main` today is scaffolding + team process docs so five people with mixed Git experience can work in parallel without stepping on each other. Looking for feedback on:

- Monorepo split (hardware / database / frontend / docs)
- Branch ownership and merge-safe progress logs
- Stack choice (vanilla + Supabase + Arduino vs heavier frameworks)
- Schema shape for attendance + points

Questions or suggested changes → message Vidhu
