# Tap-In Progress Tracker (Index)

Each branch has its **own** progress file under `docs/progress/`. That way logs merge into `main` as separate files — no fight over one shared tracker.

**Do not append work logs here.** Edit only your branch’s file below.

| Branch | Who (edit if needed) | Progress file (tag this in Copilot) | Code you own |
|--------|----------------------|-------------------------------------|--------------|
| `branch-backend-core` | Vidhu | [`docs/progress/backend-core.md`](progress/backend-core.md) | `frontend/js/supabase.js`, shared `/docs/` guides (not other people’s progress files), backend logic |
| `branch-hardware` | Kathleen | [`docs/progress/hardware.md`](progress/hardware.md) | `/hardware/` |
| `branch-member-ui` | Turner | [`docs/progress/member-ui.md`](progress/member-ui.md) | `frontend/index.html`, `frontend/dashboard.html` |
| `branch-db-onboarding` | Jayati/Kailash | [`docs/progress/db-onboarding.md`](progress/db-onboarding.md) | `/database/schema.sql`, `frontend/register.html` |
| `branch-admin-analytics` | Jayati/Kailash | [`docs/progress/admin-analytics.md`](progress/admin-analytics.md) | `frontend/admin.html` |

### Copilot tagging (per person)

Always tag:

1. `@docs/AI_CODING_SKILLS.md`
2. **Your** progress file (e.g. `@docs/progress/member-ui.md`) — never someone else’s
3. The code file you are editing

### Merge-safe rule

- Shared guides (`AI_CODING_SKILLS.md`, `GIT_AND_COPILOT_GUIDE.md`, `.github/copilot-instructions.md`, this index) → **Team Lead only** unless Lead says otherwise.
- Your `docs/progress/<your-file>.md` + your code paths → **you only**.

See also: `docs/GIT_AND_COPILOT_GUIDE.md`.
