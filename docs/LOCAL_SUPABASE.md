# Supabase setup (cloud only)

**Use a free cloud Supabase project.** Do not run Docker / `npx supabase start` for this app — it causes more friction than it is worth, and the HTML frontend does not need a local database.

The `supabase/` CLI folder in the repo is legacy. Ignore it. Source of truth for SQL is **`database/*.sql`** pasted into the cloud SQL Editor.

---

## 1. Create keys file

```bash
cp frontend/js/supabase.local.js.example frontend/js/supabase.local.js
cp frontend/js/admin.local.js.example frontend/js/admin.local.js
```

## 2. Paste cloud URL + anon key

1. Open [supabase.com](https://supabase.com) → your project → **Project Settings → API**
2. Copy **Project URL** and the **anon / public** key (never the service_role key)
3. Put them in gitignored `frontend/js/supabase.local.js`:

```js
export const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

If `backend/` is used for hardware taps, put the **same** values in `backend/.env` (copy from `backend/.env.example`).

## 3. Run SQL once (cloud SQL Editor)

Paste and run, in order:

1. [`database/schema.sql`](../database/schema.sql) — tables
2. [`database/rpc_handle_scan.sql`](../database/rpc_handle_scan.sql) — scan function
3. [`database/lead_explore_seed.sql`](../database/lead_explore_seed.sql) — MVP anon RLS grants + team directory + sample event
4. [`database/phase2_nullable_rfid.sql`](../database/phase2_nullable_rfid.sql) — allow account signup before RFID bind

If you already applied an older `schema.sql` without `is_archived`, the seed file adds that column safely.

**Auth (Phase 2):** For local demos, in Supabase → Authentication → Providers → Email, disable **Confirm email** so `signUpWithPassword` returns a session immediately. Keep RLS open (seed policies) until Kathleen’s hardware tap path works.

## 4. Serve the frontend

```bash
cd frontend
python3 -m http.server 5500
```

Open **http://localhost:5500/index.html**

| Page | Purpose |
|------|---------|
| `index.html` | Member sign-in (Turner wires password Auth helpers) |
| `register.html` | Create Auth account first; optional RFID bind |
| `dashboard.html` | Live points + attendance |
| `admin.html` | Chapter admin — events, vertical chart, simulate scan |

Hardware tap path (Arduino → scan RPC / `backend/` receive): see [`docs/HARDWARE_TAP_PATH.md`](HARDWARE_TAP_PATH.md).

---

## Do not use Docker

| Skip this | Why |
|-----------|-----|
| Docker Desktop | Not required for the app |
| `npx supabase start` / `db reset` | Local stack is unused |
| `http://127.0.0.1:54321` keys | Point at `https://….supabase.co` instead |

Only reconsider Docker if a future requirement truly cannot run against cloud Supabase (none today).
