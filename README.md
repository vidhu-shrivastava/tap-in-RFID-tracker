# Tap-In RFID Attendance Tracker

**Status: DONE (MVP complete — Phase 1 + Phase 2)**

University engineering-fraternity SWE project: members create an account, bind an RFID card once, tap in at events, and see attendance points on simple web dashboards. Execs manage events and analytics from a gated admin shell.

```text
Card → RC522 → Arduino → POST /scan → handle_rfid_scan → attendance_logs + points → dashboards
```

---

## What shipped

| Area | Done |
|------|------|
| **Auth** | Email + password via Supabase Auth (no Google). Account first, RFID bind later. |
| **Member UI** | Sign-in / sign-up, dashboard (points + history), profile settings, theme toggle |
| **RFID bind** | One-time bind from dashboard → `register.html`; CTA hides once bound |
| **Admin** | Profile-menu Admin link only if member RFID contains `ADMIN`; chapter password gate; events + vertical attendance chart + simulate scan |
| **Database** | `members`, `events`, `attendance_logs` + `handle_rfid_scan` RPC |
| **Hardware receive** | `backend/receive_scan.py` accepts `POST /scan` so keys stay off firmware |
| **Hardware sketch** | Arduino UNO R4 WiFi + RC522 UID read (Serial); WiFi tap path documented |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Vanilla HTML5, Tailwind CDN, Vanilla JS |
| Data | Cloud Supabase (PostgreSQL + JS client CDN) |
| Auth | Supabase Auth email/password |
| Hardware receive | `backend/receive_scan.py` (stdlib Python) |
| Hardware | Arduino C++ on UNO R4 WiFi + RC522 |
| Analytics | Chart.js CDN (admin) |

No React, bundlers, Flask, Next, or Docker.

Guides: [`docs/AI_CODING_SKILLS.md`](docs/AI_CODING_SKILLS.md) · [`docs/LOCAL_SUPABASE.md`](docs/LOCAL_SUPABASE.md) · [`docs/HARDWARE_TAP_PATH.md`](docs/HARDWARE_TAP_PATH.md) · [`docs/GIT_AND_COPILOT_GUIDE.md`](docs/GIT_AND_COPILOT_GUIDE.md)

---

## Repo layout

```text
/
├── docs/                       # Guides + per-role progress logs
├── database/                   # Schema, scan RPC, seed, Phase 2 SQL
├── frontend/                   # HTML pages + js/supabase.js
├── backend/                    # Thin HTTP receive for hardware taps
└── hardware/tap_in_scanner/    # Arduino sketch
```

Progress index: [`docs/PROGRESS_TRACKER.md`](docs/PROGRESS_TRACKER.md).  
The `supabase/` CLI folder is unused legacy — SQL lives in `database/`.

---

## Team (who built what)

| Role | Person | Primary deliverables |
|------|--------|----------------------|
| Lead / backend | Vidhu | `supabase.js` Auth + helpers, scan RPC, admin shell wiring, `backend/`, docs |
| Member UI | Turner | `index.html`, `dashboard.html`, `profile-settings.html` |
| Schema / register | Jayati | `database/schema.sql`, `register.html` |
| Admin / analytics | Kailash (w/ Jayati) | `admin.html` chart + exec UX (merged/polished on main) |
| Hardware | Kathleen | `/hardware/` RC522 UID read |

Feature work landed on feature branches, then merged into **`main`**.

---

## Secrets (what may / may not be committed)

| File | Tracked? | Contains |
|------|----------|----------|
| `frontend/js/supabase.local.js` | Yes (for hosting) | Cloud Project URL + **anon** / public key |
| `frontend/js/admin.local.js` | **No** (gitignored) | Chapter admin gate password |
| `backend/.env` | **No** (gitignored) | Same URL + anon for hardware receive on the server |

The Supabase **anon** key is designed for browser use (same as shipping it in any frontend). Protection is Row Level Security + Auth — not hiding the anon key.

**Never** commit `service_role` / secret keys, WiFi passwords, Auth passwords, or `admin.local.js`.  
If `git status` lists `admin.local.js` or `backend/.env` as staged — unstage immediately.

---

## Quick start

1. Copy local secrets and paste your cloud URL + anon key (and optional admin password):

```bash
cp frontend/js/supabase.local.js.example frontend/js/supabase.local.js
cp frontend/js/admin.local.js.example frontend/js/admin.local.js
# optional for hardware receive:
cp backend/.env.example backend/.env
```

2. In the Supabase SQL Editor, run once (in order) — details in [`docs/LOCAL_SUPABASE.md`](docs/LOCAL_SUPABASE.md):

   1. `database/schema.sql`
   2. `database/rpc_handle_scan.sql`
   3. `database/lead_explore_seed.sql`
   4. `database/phase2_nullable_rfid.sql`

3. For local Auth demos: Supabase → Authentication → Providers → Email → disable **Confirm email**.

4. Serve the frontend:

```bash
cd frontend
python3 -m http.server 5500
```

Open **http://localhost:5500/index.html**.

| Flow | How |
|------|-----|
| Create account / sign in | `index.html` → `dashboard.html` |
| Bind RFID (once) | Dashboard → Register RFID card → `register.html` |
| Member points / history | `dashboard.html` |
| Profile cosmetics | `profile-settings.html` |
| Admin | Signed-in member with RFID containing `ADMIN` → Account → Admin → chapter password |
| Simulate tap | Admin → enter UID → Run scan RPC |
| Hardware receive | `cd backend && python3 receive_scan.py` — see [`docs/HARDWARE_TAP_PATH.md`](docs/HARDWARE_TAP_PATH.md) |

**Admin rule:** a member is admin when `members.rfid_uid` contains `ADMIN` (case-insensitive). Seed example: `vidhu.shrivastava@uga.edu` / `ADMIN001`. Create a Supabase Auth account for that email (sign up once), then open Admin from the profile menu.

---

## Database (MVP)

- **`members`** — `id`, `full_name`, `email`, `rfid_uid` (nullable until bound), `total_points`
- **`events`** — `id`, `event_name`, `event_date`, `point_value`, `is_active`, `is_archived`
- **`attendance_logs`** — `id`, `member_id`, `event_id`, `scanned_at`
- **RPC** — `handle_rfid_scan(scanned_uid)`

---

## Progress logs

Each role keeps a readable status + work log under `docs/progress/`:

| File | Who |
|------|-----|
| [`docs/progress/main.md`](docs/progress/main.md) | Lead — final integration / DONE |
| [`docs/progress/backend-core.md`](docs/progress/backend-core.md) | Vidhu |
| [`docs/progress/member-ui.md`](docs/progress/member-ui.md) | Turner |
| [`docs/progress/db-onboarding.md`](docs/progress/db-onboarding.md) | Jayati |
| [`docs/progress/admin-analytics.md`](docs/progress/admin-analytics.md) | Kailash / Jayati |
| [`docs/progress/hardware.md`](docs/progress/hardware.md) | Kathleen |

Index: [`docs/PROGRESS_TRACKER.md`](docs/PROGRESS_TRACKER.md).

---

Questions → message Vidhu
