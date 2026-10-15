# Week 1 Plan — Backend Core (Vidhu)

**Branch:** `backend-core` | **Owner:** Vidhu 
**Vibe:** Build the database logic that catches the hardware's data and updates the system.

---

## 1. The Goal

Write the **PostgreSQL RPC function** that handles incoming RFID scans and **initialize the Supabase JS client**.

By end of Week 1 you should have:

- A `handle_rfid_scan(scanned_uid TEXT)` RPC that looks up the member, finds the active event, blocks duplicates, logs attendance, and increments points
- Shared client init boilerplate in `frontend/js/supabase.js` ready for other branches to import

---

## 2. Files to Edit

Only edit these (create the SQL file if it does not exist yet):

```text
database/rpc_handle_scan.sql
frontend/js/supabase.js
```

**Stay on `backend-core`.** Do **not** push to `main`. Shared guides stay Lead-owned; do not overwrite teammates’ `docs/progress/*` files.

---

## 3. Step-by-Step Tasks

Check items off as you go.

### `database/rpc_handle_scan.sql` — `handle_rfid_scan(scanned_uid TEXT)`

- [x] Create `database/rpc_handle_scan.sql` if missing
- [x] Define a PostgreSQL function: **`handle_rfid_scan(scanned_uid TEXT)`**
- [x] **Look up `member_id`** from `members` where `rfid_uid` matches `scanned_uid`
- [x] **Find active `event_id`** from `events` where `is_active = true` (decide clear behavior if none / more than one)
- [x] **Check for duplicate logs** — same member + same event already in `attendance_logs` (reject / no-op / return a clear status)
- [x] **INSERT** into `attendance_logs` (`member_id`, `event_id`, `scanned_at`)
- [x] **Increment** `members.total_points` by the active event’s `point_value`
- [x] Return a useful result (e.g. success/error reason, updated points) so hardware / frontend can react
- [x] Comment the function heavily so teammates can follow the scan path

### `frontend/js/supabase.js` — client init boilerplate

- [x] Replace the placeholder with Supabase client init boilerplate
- [x] Use URL + anon key placeholders (or env-style constants) — **do not commit real secrets**
- [x] Export a shared `supabase` client / helpers other pages can use
- [x] Keep it simple: CDN-compatible Vanilla JS patterns per `AI_CODING_SKILLS.md`
- [x] Leave a short comment on how HTML pages should load / import this file

### Smoke check

- [x] Mentally / on paper walk one scan: unknown UID → registered UID → duplicate tap
- [ ] Confirm JS file loads without syntax errors in the browser console (even if URL/key are still placeholders)

---

## 4. AI Prompt to Use (Cursor)

Copy everything in the box below into Cursor Chat. Keep the `@` tags so the agent follows team rules.

```text
@docs/AI_CODING_SKILLS.md @docs/progress/backend-core.md @database/rpc_handle_scan.sql @frontend/js/supabase.js

I am on branch backend-core (Team Lead). Help me finish Week 1 for Backend Core.

Requirements:
1. Create/write database/rpc_handle_scan.sql with a PostgreSQL RPC function handle_rfid_scan(scanned_uid TEXT) that:
   - Looks up member_id from members by rfid_uid
   - Finds the active event_id from events (is_active = true)
   - Checks for duplicate attendance_logs for that member + event
   - Inserts into attendance_logs on success
   - Increments members.total_points by the event point_value
   - Returns a clear success/error payload
2. Initialize frontend/js/supabase.js with Supabase JS client boilerplate (URL/anon key placeholders — no real secrets), export a shared client/helpers for other pages.
3. Keep SQL and JS simple, heavily commented, and aligned with AI_CODING_SKILLS.md tables/relationships.
4. After writing the code, remind me what to append to docs/progress/backend-core.md.

Follow AI_CODING_SKILLS.md. Do not edit other teammates’ progress files or their owned code paths.
```

---

## 5. End of Session

Ship the glue layer, then leave a trail.

### Git (run in this exact order)

```bash
git branch
git status
git add .
git commit -m "Week 1: handle_rfid_scan RPC + Supabase client init"
git push origin backend-core
```

Confirm `*` is on **`backend-core`** before you push. Never push to `main`.

### Progress log

- [x] Append a **timestamped** entry in **`docs/progress/backend-core.md`**
- [x] Include: files touched, what you built, and a one-line “how it works”
- [x] Do **not** edit `docs/PROGRESS_TRACKER.md` (index only)

Example log bullet:

```markdown
- **2026-10-13 18:00** — Files: `database/rpc_handle_scan.sql`, `frontend/js/supabase.js`.
  Built: handle_rfid_scan RPC (lookup → active event → duplicate check → insert → points++) + Supabase client init boilerplate.
  How it works: DB function is the single scan entrypoint; JS exports a shared createClient for pages to call it later.
```

---

**Week 1 success = one reliable scan function + a shared client stub.** Hardware and UI can plug in next. Write the RPC. Init the client. Commit. Done.
