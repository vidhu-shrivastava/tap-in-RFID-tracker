# Tap-In Progress Tracker (Index)

**Project status: DONE (MVP — Phase 1 + Phase 2 complete on `main`).**

Each role has its **own** progress file under `docs/progress/`. Logs merged as separate files so teammates never fought over one shared tracker.

**Do not append work logs here.** Edit only your own file below (historical logs stay; status banners mark completion).

| Branch (historical)      | Who              | Progress file                                                     | What they owned                                                                                    | Status |
| ------------------------ | ---------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------ |
| `main` (integration)     | Vidhu            | [`docs/progress/main.md`](progress/main.md)                       | Post-merge glue, cloud setup, seed/RLS, shared Auth wiring                                         | **DONE** |
| `branch-backend-core`    | Vidhu            | [`docs/progress/backend-core.md`](progress/backend-core.md)       | `frontend/js/supabase.js`, scan RPC, `backend/`, shared guides                                     | **DONE** |
| `branch-member-ui`       | Turner           | [`docs/progress/member-ui.md`](progress/member-ui.md)             | `frontend/index.html`, `dashboard.html`, `profile-settings.html`                                   | **DONE** |
| `branch-db-onboarding`   | Jayati           | [`docs/progress/db-onboarding.md`](progress/db-onboarding.md)     | `database/schema.sql`, `frontend/register.html`                                                    | **DONE** |
| `branch-admin-analytics` | Kailash / Jayati | [`docs/progress/admin-analytics.md`](progress/admin-analytics.md) | `frontend/admin.html` (chart + exec shell; polished on main)                                       | **DONE** |
| `branch-hardware`        | Kathleen         | [`docs/progress/hardware.md`](progress/hardware.md)               | `/hardware/` RC522 UID read                                                                        | **DONE** (Serial UID; WiFi path documented via `backend/`) |

### How to read a progress file

1. **Status** at the top — current DONE summary (plain English).
2. **AI Work Log** — timestamped build history (do not delete old bullets).
3. **Member Plain-English Summary** — written by the human teammate only.

### Secrets reminder

Never put real Supabase keys, admin passwords, or Auth passwords in any progress file. Keys live only in gitignored `*.local.js` / `backend/.env`.

See also: `docs/GIT_AND_COPILOT_GUIDE.md`, root [`README.md`](../README.md).
