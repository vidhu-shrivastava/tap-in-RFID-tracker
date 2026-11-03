# Local Supabase (run from the IDE)

Yes — you can run Postgres + the Supabase API on your machine. It needs **Docker Desktop** (the Supabase CLI starts local containers).

## One-time setup

1. Install **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** for Mac and open it (whale icon running).
2. From the repo root in the Cursor terminal:

```bash
npx supabase start
```

First run downloads images (a few minutes). When it finishes, it prints **API URL** and **anon key**.

3. Point the frontend at local Supabase — edit gitignored `frontend/js/supabase.local.js`:

```js
export const SUPABASE_URL = "http://127.0.0.1:54321";
export const SUPABASE_ANON_KEY = "paste-anon-key-from-supabase-start";
```

Get the key anytime with:

```bash
npx supabase status
```

4. Serve the frontend:

```bash
cd frontend
python3 -m http.server 5500
```

Then open `http://localhost:5500/lead-explore.html`.

## Useful commands (repo root)

| Command | What it does |
|---------|----------------|
| `npx supabase start` | Start local API + DB |
| `npx supabase stop` | Stop containers |
| `npx supabase status` | Show URL + keys |
| `npx supabase db reset` | Re-apply migrations + `supabase/seed.sql` |
| `npx supabase studio` | Open local Studio in the browser (table UI) |

Local Studio is usually at **http://127.0.0.1:54323** after `start`.

## How this relates to `/database/`

| Cloud (supabase.com) | Local (this repo) |
|----------------------|-------------------|
| Paste `database/*.sql` in SQL Editor | `supabase/migrations/` + `supabase/seed.sql` |

Teammates keep editing `database/schema.sql` and `database/rpc_handle_scan.sql` as before. When those change, update the matching migration (or add a new migration) so local stays in sync.

## Switch back to cloud

Put your real project URL + anon key back into `supabase.local.js` (from Project Settings → API). No code change required elsewhere.
