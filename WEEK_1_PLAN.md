# Week 1 Plan — Database & Onboarding (Jayati)

**Branch:** `db-onboarding` | **Owner:** Jayati 
**Vibe:** Lay the data foundation and build the form to link physical cards to people.

---

## 1. The Goal

Define the **Supabase PostgreSQL schema** and build a **static HTML form** to register new RFID cards.

By end of Week 1 you should have:

- Real `CREATE TABLE` statements for the core tables
- Sample `INSERT` data so the schema is easy to test
- A clean registration form UI (static is fine — wire Supabase later)

---

## 2. Files to Edit

Only edit these two files:

```text
database/schema.sql
frontend/register.html
```

**Stay on** `db-onboarding`**.** Do **not** push to `main`. Do **not** edit files outside Database & Onboarding ownership (`database/schema.sql`, `frontend/register.html`, and your progress log).

---



## 3. Step-by-Step Tasks

Check items off as you go.

### `database/schema.sql` — CREATE TABLE statements

Uncomment / rewrite the placeholders into real SQL for:

- [ ] `members` — people who tap in with RFID cards  
  Suggested columns: `id` (uuid PK), `full_name`, `email` (unique), `rfid_uid` (unique), `total_points` (default 0)
- [ ] `events` — meetings / activities that award points  
  Suggested columns: `id` (uuid PK), `event_name`, `event_date`, `point_value`, `is_active` (default false)
- [ ] `attendance_logs` — one row per successful tap  
  Suggested columns: `id` (uuid PK), `member_id` (FK → `members.id`), `event_id` (FK → `events.id`), `scanned_at` (timestamptz, default `now()`)



### Dummy data — 5 INSERT statements

- [ ] Write **5** `INSERT` **statements** total with realistic dummy data  
  Example mix: a few `members`, at least one `events` row, and maybe an `attendance_logs` row that references them
- [ ] Make sure foreign keys match (attendance rows must use real member/event ids from your inserts)
- [ ] Keep comments above each block so teammates can read the schema easily



### `frontend/register.html` — Tailwind registration form

- [ ] Keep Vanilla HTML + Tailwind CSS via CDN (`https://cdn.tailwindcss.com`)
- [ ] Build / finish a form with inputs for:
  - [ ] **Full Name**
  - [ ] **Email**
  - [ ] **RFID Hex String** (the card UID, e.g. `A1B2C3D4`)
- [ ] Enable the inputs (remove `disabled` if still present)
- [ ] Add a clear Submit button
- [ ] For Week 1: `preventDefault` on submit is OK — **static form UI only** (no live Supabase insert required yet)
- [ ] Open the page in a browser and confirm the form looks clean on desktop and mobile width

---



## 4. AI Prompt to Use (GitHub Copilot)

Copy everything in the box below into Copilot Chat. Keep the `@` tags so Copilot follows team rules.

```text
@docs/AI_CODING_SKILLS.md @docs/progress/db-onboarding.md @database/schema.sql @frontend/register.html

I am on branch db-onboarding. Help me finish Week 1 for Database & Onboarding.

Requirements:
1. In database/schema.sql: write real PostgreSQL CREATE TABLE statements for members, events, and attendance_logs (uuid PKs, unique email/rfid_uid on members, FKs on attendance_logs). Match the column ideas already sketched in the file and AI_CODING_SKILLS.md.
2. Add exactly 5 INSERT statements with dummy data that respect foreign keys.
3. In frontend/register.html: build a clean Vanilla HTML + Tailwind CDN form with inputs for Full Name, Email, and RFID Hex String, plus a Submit button. Static UI only for Week 1 (preventDefault is fine; no live Supabase yet).
4. Keep SQL and HTML simple, commented, and beginner-friendly.
5. After writing the code, remind me what to log in docs/progress/db-onboarding.md.

Follow AI_CODING_SKILLS.md. Do not edit files outside my Database & Onboarding ownership except my progress log.
```

---



## 5. End of Session

Before you close the laptop, ship your work and leave a trail.

### Git (run in this exact order)

```bash
git branch
git status
git add .
git commit -m "Week 1: schema tables + card registration form"
git push origin db-onboarding
```

Confirm `*` is on `db-onboarding` before you push. Never push to `main`.

### Progress log

- [ ] Append a **timestamped** entry in `docs/progress/db-onboarding.md`
- [ ] Include: files touched, what you built, and a one-line “how it works”
- [ ] Do **not** edit `docs/PROGRESS_TRACKER.md` (that file is only the index)

Example log bullet:

```markdown
- **2026-10-13 18:00** — Files: `database/schema.sql`, `frontend/register.html`.
  Built: CREATE TABLE for members/events/attendance_logs + 5 dummy INSERTs; static Tailwind register form (name, email, RFID hex).
  How it works: schema defines FKs for taps; form UI collects card↔person fields for later Supabase insert.
```

---

**Week 1 success = solid tables + a clear registration form.** Live Supabase inserts and RLS can wait. Define the data. Build the form. Commit. Done.

**Make sure to have Ai check off the boxes and checklist as you complete features and tasks**