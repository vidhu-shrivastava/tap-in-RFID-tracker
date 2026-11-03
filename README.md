# Tap-In RFID Attendance Tracker

University engineering-fraternity SWE MVP: members tap an RFID card at events, attendance is logged in Supabase, and points show up on simple web dashboards.

| Phase | Focus |
|-------|--------|
| **Phase 1** | Schema, scan RPC, member + admin web UIs, cloud Supabase wiring, Arduino UID read over Serial |
| **Phase 2** | Account auth, polished dashboards, hardware WiFi tap path (Arduino → receive server → DB) |

---

## What it does

1. **Hardware** scans an RFID card (Arduino UNO R4 WiFi + RC522; OLED + buzzer planned).
2. **Database** stores members, events, and attendance logs (Supabase PostgreSQL + `handle_rfid_scan` RPC).
3. **Web UI** lets members register / see points, and execs manage events and attendance analytics.
4. **Backend receive** accepts `POST /scan` from the scanner so secrets stay off the firmware (KTP host later).

```text
Card → RC522 → Arduino → POST /scan → handle_rfid_scan → attendance_logs + points → dashboards
```

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Vanilla HTML5, Tailwind CSS via CDN, Vanilla JS |
| Data | Cloud Supabase (PostgreSQL + JS client via CDN) |
| Hardware receive | `backend/receive_scan.py` (stdlib Python) |
| Hardware | Arduino C++ on UNO R4 WiFi |
| Analytics | Chart.js CDN (admin) |
| Tooling | VS Code + GitHub Copilot — no React, bundlers, or Flask/Next |

Guides: [`docs/AI_CODING_SKILLS.md`](docs/AI_CODING_SKILLS.md) · [`docs/LOCAL_SUPABASE.md`](docs/LOCAL_SUPABASE.md) · [`docs/HARDWARE_TAP_PATH.md`](docs/HARDWARE_TAP_PATH.md) · [`docs/GIT_AND_COPILOT_GUIDE.md`](docs/GIT_AND_COPILOT_GUIDE.md)

---

## Repo layout

```text
/
├── docs/                       # Guides + per-branch progress logs
├── database/                   # Schema, scan RPC, cloud seed SQL
├── frontend/                   # HTML pages + js/supabase.js
├── backend/                    # Thin HTTP receive for hardware taps
└── hardware/tap_in_scanner/    # Arduino sketch
```

Progress logs are per branch under `docs/progress/` so parallel work merges cleanly. Index: [`docs/PROGRESS_TRACKER.md`](docs/PROGRESS_TRACKER.md).

The `supabase/` CLI folder is unused legacy — SQL lives in `database/`. **No Docker.**

---

## Team branches & ownership

| Branch | Owner | Owns |
|--------|--------|------|
| `branch-backend-core` | Vidhu (Lead) | `frontend/js/supabase.js`, `database/rpc_handle_scan.sql`, `backend/`, shared docs |
| `branch-hardware` | Kathleen | `/hardware/` |
| `branch-member-ui` | Turner | `frontend/index.html`, `frontend/dashboard.html`, `frontend/profile-settings.html` |
| `branch-db-onboarding` | Jayati | `database/schema.sql`, `frontend/register.html` |
| `branch-admin-analytics` | Kailash | `frontend/admin.html` |

**Rule:** Stay on your branch. Never push to `main`. Only edit your assigned files (+ your own `docs/progress/<file>.md`).

---

## Database (MVP schema)

- **`members`** — `id`, `full_name`, `email`, `rfid_uid`, `total_points`
- **`events`** — `id`, `event_name`, `event_date`, `point_value`, `is_active`, `is_archived`
- **`attendance_logs`** — `id`, `member_id`, `event_id`, `scanned_at`
- **RPC** — `handle_rfid_scan(scanned_uid)`

Details: [`database/schema.sql`](database/schema.sql), [`database/rpc_handle_scan.sql`](database/rpc_handle_scan.sql), [`docs/AI_CODING_SKILLS.md`](docs/AI_CODING_SKILLS.md).

---

## Quick start (cloud Supabase)

1. Copy local secrets (gitignored):

```bash
cp frontend/js/supabase.local.js.example frontend/js/supabase.local.js
cp frontend/js/admin.local.js.example frontend/js/admin.local.js
```

2. Paste your cloud Supabase Project URL + anon key into `supabase.local.js`, then run the SQL under `database/` in the Supabase SQL Editor (see [`docs/LOCAL_SUPABASE.md`](docs/LOCAL_SUPABASE.md)).

3. Serve the frontend:

```bash
cd frontend
python3 -m http.server 5500
```

Open **http://localhost:5500/index.html**.

| Flow | How |
|------|-----|
| Register | `register.html` |
| Sign in | `index.html` → `dashboard.html` |
| Admin | `admin.html` (password from `admin.local.js`) |
| Test scan | Admin → RFID UID → `handle_rfid_scan` |
| Hardware receive | `cd backend && python3 receive_scan.py` — see [`docs/HARDWARE_TAP_PATH.md`](docs/HARDWARE_TAP_PATH.md) |

### Teammate workflow

```bash
git clone <repo-url>
cd tap-in-RFID-tracker
git checkout <your-branch-name>
git branch   # confirm * is on YOUR branch
```

When prompting Copilot, tag `@docs/AI_CODING_SKILLS.md`, your `@docs/progress/<file>.md`, and the file you are editing.

---

Questions → message Vidhu
