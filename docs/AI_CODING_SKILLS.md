# AI Coding Skills — Tap-In RFID Attendance Tracker

> **For GitHub Copilot / AI assistants:** Follow these rules on every response.
> Team members should always tag this file with `@docs/AI_CODING_SKILLS.md` in Copilot Chat.
> A copy of the core rules also lives in `.github/copilot-instructions.md` for automatic Copilot context.

---

## Baseline Project Architecture Rules

### Tech Stack Constraints (NON-NEGOTIABLE)

| Allowed | Not allowed |
|---------|-------------|
| Vanilla HTML5 | React, Vue, Svelte, Angular, Next.js |
| Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com">`) | Tailwind build pipeline, PostCSS, Vite, Webpack, Parcel |
| Vanilla JavaScript (ES modules OK if simple) | TypeScript build steps, jQuery-heavy apps, framework state libs |
| Supabase JS client via CDN | Custom Node backends unless Team Lead adds them later |
| Standard Arduino C++ for UNO R4 WiFi | MicroPython, PlatformIO complexity beyond what beginners need |

**Keep all code simple and heavily commented** so beginner developers can read and explain every line.

### Monorepo Layout

```text
/
├── docs/
│   ├── AI_CODING_SKILLS.md        # Shared rules (Team Lead)
│   ├── GIT_AND_COPILOT_GUIDE.md   # Shared guide (Team Lead)
│   ├── PROGRESS_TRACKER.md        # Index only — do not log work here
│   └── progress/                  # Per-branch logs (merge-safe)
│       ├── backend-core.md
│       ├── hardware.md
│       ├── member-ui.md
│       ├── db-onboarding.md
│       └── admin-analytics.md
├── database/
│   ├── README.md                  # Who owns which SQL file (do not delete siblings)
│   ├── schema.sql                 # Tables — branch-db-onboarding
│   └── rpc_handle_scan.sql        # Scan RPC — branch-backend-core (do not delete)
├── frontend/
│   ├── index.html                 # Member landing / login entry
│   ├── dashboard.html             # Member dashboard
│   ├── register.html              # Card / member registration form
│   ├── admin.html                 # Exec admin dashboard & analytics
│   └── js/
│       └── supabase.js            # Shared Supabase client helpers
└── hardware/
    └── tap_in_scanner/
        └── tap_in_scanner.ino     # Arduino UNO R4 WiFi + RC522 + OLED + Buzzer
```

### Branch Ownership

| Branch | Role | Files |
|--------|------|-------|
| `branch-backend-core` | Vidhu | `frontend/js/supabase.js`, `database/rpc_handle_scan.sql`, shared docs guides, `docs/progress/backend-core.md`, backend logic |
| `branch-hardware` | Kathleen | `/hardware/`, `docs/progress/hardware.md` |
| `branch-member-ui` | Turner | `frontend/index.html`, `frontend/dashboard.html`, `docs/progress/member-ui.md` |
| `branch-db-onboarding` | Jayati/Kailash | `database/schema.sql` only (do **not** delete other `/database/` files), `frontend/register.html`, `docs/progress/db-onboarding.md` |
| `branch-admin-analytics` | Jayati/Kailash | `frontend/admin.html`, `docs/progress/admin-analytics.md` |

**Merge-safe rule:** Each person edits only their code paths + their own `docs/progress/<file>.md`. Shared guides and `docs/PROGRESS_TRACKER.md` (index) are Team Lead–owned so parallel branches do not conflict.
---

## Database Schema Reference (Supabase PostgreSQL)

Use these exact table/column names unless the Team Lead updates this doc.

### `members`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `full_name` | `text` | Member display name |
| `email` | `text` | Unique |
| `rfid_uid` | `text` | Unique RFID card UID |
| `total_points` | `int4` | Default `0` |

### `events`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `event_name` | `text` | |
| `event_date` | `date` | |
| `point_value` | `int4` | Points awarded per check-in |
| `is_active` | `boolean` | Default `false` — only active event accepts taps |

### `attendance_logs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `member_id` | `uuid` | FK → `members.id` |
| `event_id` | `uuid` | FK → `events.id` |
| `scanned_at` | `timestamptz` | Default `now()` |

**Relationships:** One member has many attendance logs. One event has many attendance logs. Scanning an RFID card should resolve `rfid_uid` → `members`, then insert into `attendance_logs` for the active event and update `members.total_points`.

---

## Coding Style Expectations for AI Output

1. Prefer clear, boring, readable code over clever abstractions.
2. Comment **why** and **what** in plain English — beginners must be able to demo their work.
3. Use Tailwind utility classes in HTML; avoid large custom CSS files unless necessary.
4. Put shared Supabase setup in `frontend/js/supabase.js`; pages should import/use those helpers rather than duplicating secrets or client init.
5. Never invent tables/columns that are not in the schema above.
6. Never introduce React, npm build tools, or bundlers.
7. Hardware code targets Arduino UNO R4 WiFi with RC522 RFID, OLED display, and buzzer — keep sketches modular and commented.

---

## Reminder for AI: Update Progress Tracker

After completing code changes (and whenever a teammate is about to commit/push), **always append** a timestamped (`YYYY-MM-DD HH:MM`) bullet to **that teammate’s own file** under `docs/progress/` (see index in `docs/PROGRESS_TRACKER.md`). Never write logs into the index file. Never edit another branch’s progress file.

Each entry must include:

1. Files modified/created  
2. Features / UI / SQL / hardware functions built  
3. Brief under-the-hood technical explanation  

**Never** delete past entries. **Never** write the Human Summary section.

Also remind the human to ask: *"Add clear comments to this code and explain how it works in simple terms."*

---

## Custom Team Coding Skills (Adapted for Tap-In MVP)

> Adapted from the Team Lead’s full-stack study-groups skills list.
> **Stack override is absolute:** Vanilla HTML + Tailwind CDN + Vanilla JS + Supabase CDN + Arduino C++.
> Do **not** introduce Next.js, Flask, React, Framer Motion, Lucide React, Zod npm packages, shadcn/ui, Vite, or JWT session servers unless the Team Lead explicitly changes this doc.

---

### 1. Superpowers Workflow (5 phases before big features)

Before writing a non-trivial feature (new page section, schema change, RFID scan flow, admin chart, etc.), guide development through these phases. Do not jump straight to a giant code dump.

1. **Clarify** — Ask short clarifying questions about the feature, which branch/files are in scope, Supabase tables/columns needed, hardware behavior (OLED text, buzzer tones, WiFi), and beginner-readability constraints.
2. **Spec** — Explicitly define: data touched (`members` / `events` / `attendance_logs`), Supabase queries or RLS assumptions, HTML/UI blocks, and (for hardware) pin/sensor flow. No vague “build the dashboard.”
3. **Plan** — Break into micro-steps. Do **not** batch huge edits across HTML + SQL + Arduino + `supabase.js` in one shot. One concern per step.
4. **Execute** — Build incrementally. Prefer a tiny smoke-check first (e.g., console.log a Supabase select, Serial.print a UID, render one Tailwind block) before expanding.
5. **Review** — Check for: missing error/empty/loading UI text, duplicated Supabase client init, uncommented magic, SQL/schema drift from this doc, and hardware loop blocking / missing timeouts.

If the teammate says “just write the code,” still do a **one-paragraph Spec + Plan**, then Execute in small chunks.

---

### 2. Context Management Protocol (GSD)

To prevent code degradation, memory rot, and hallucinated functions:

- At the start of a major feature, **verify the exact current file state** (read the real file contents) before writing new code.
- Keep output punchy. Do **not** rewrite a whole HTML/`.ino`/`schema.sql` file when only a few lines need to change.
- Prefer surgical edits with clear comments over regenerating entire pages.
- If the chat is getting clogged or the AI seems to invent helpers/tables that do not exist, **explicitly prompt the human to reset the chat** and tell them exactly what state to paste next (branch name, files in scope, last working behavior, and link `@docs/AI_CODING_SKILLS.md` + their `@docs/progress/<branch-file>.md`).

---

### 3. “Lazy Dev” Protocol (fight over-engineering)

- Actively challenge unnecessary libraries. If native JS (`fetch`, `FormData`, `URLSearchParams`, `Intl.DateTimeFormat`) or Arduino core APIs already do the job, use them.
- Prefer **Supabase JS CDN client** over inventing a custom REST/Flask backend.
- Prefer **Chart.js via CDN OR Retool if we decided to use it** (admin only) over React chart ecosystems.
- Prefer **CSS transitions / Tailwind** over animation frameworks.
- Keep structure flat: one explicit function beats a deep utility abstraction layer.
- If a teammate asks for a micro-library, challenge it once with a simpler native alternative, then proceed with whatever the Team Lead decides.

---

### 4. Tap-In Architecture System (replaces Next.js + Flask skills)

**Separation of concerns for this monorepo:**

| Layer | Responsibility | Where it lives |
|-------|----------------|----------------|
| Hardware | Read RFID UID, show OLED feedback, beep, send UID to backend path chosen by Lead | `hardware/tap_in_scanner/` |
| Data | Tables, constraints, indexes, RLS policies | `database/schema.sql` + Supabase dashboard |
| Shared client | Supabase URL/anon key init + reusable query helpers | `frontend/js/supabase.js` |
| Member UI | Landing + personal points/attendance views | `frontend/index.html`, `frontend/dashboard.html` |
| Onboarding | Register member + RFID UID | `frontend/register.html` |
| Admin | Events, analytics, Chart.js / Retool views | `frontend/admin.html` |

**Auth model for MVP (keep simple unless Lead upgrades):**

- Prefer Supabase Auth **or** a tightly scoped anon-key + Row Level Security design — **not** legacy server-rendered session cookie apps, and **not** a custom Flask JWT service.
- Never hardcode the Supabase **service role** key in frontend HTML/JS.
- Fail closed: if a query/auth check fails, show a clear error message; do not pretend the write succeeded.

**UI presentation for a student-org MVP (not a SaaS dark-glow aesthetic):**

- Clean, readable Tailwind layouts beginners can explain.
- Light-first pages with clear typography and spacing; avoid purple-glow / neon SaaS tropes unless the team explicitly brands that way later.
- Every async UI path needs visible **loading**, **empty**, and **error** text (simple Tailwind blocks are enough — no `loading.tsx` / React error boundaries).

---

### 5. Frontend Vibe Rules (Vanilla + Tailwind CDN)

When building or polishing UI:

- Stack: HTML pages + Tailwind CDN + Vanilla JS (+ Chart.js CDN on admin if needed).
- Use small CSS/`transition` polish (hover elevation, button press opacity) — **not** Framer Motion / React icon packs.
- Prefer accessible HTML: real `<button>`, `<label>`, `<form>`, meaningful headings, sufficient contrast.
- Cards/sections only when they group an interaction or a clear data block; do not invent dashboard chrome for its own sake.
- After writing UI/logic, always offer: clear comments + a simple plain-English explanation the teammate can repeat in a demo.

---

### 6. Database Hygiene Rules (Supabase PostgreSQL)

When creating or modifying schema / SQL / queries:

- Prefer additive, non-locking changes (add column/index carefully; avoid heavy rewrites on live tables).
- Every foreign key column should have an **explicit index** (e.g., `attendance_logs(member_id)`, `attendance_logs(event_id)`).
- Watch for N+1 patterns in JS (do not query inside a loop when one joined/select can do it).
- Soft deletes (`deleted_at`) are preferred for **new** relational tables if the Lead expands schema; do not silently rewrite the MVP tables unless asked — document the proposal first.
- Stay aligned with the schema reference above; never invent columns mid-feature without updating `database/schema.sql` and this doc.

---

### 7. Shannon SecOps Protocol (Tap-In / Supabase edition)

Act as a ruthless InfoSec reviewer on data and hardware-adjacent changes:

- **Access control:** Assume frontend users are untrusted. Prefer Supabase RLS policies so members cannot edit other members’ points or invent attendance rows.
- **Secrets:** Only anon/public keys in browser code. Service role / WiFi passwords / API secrets stay out of committed frontend files (use placeholders + local config notes).
- **Injection:** Use Supabase client parameterized filters — never string-concatenate raw SQL in JS.
- **Validation:** Validate forms in Vanilla JS before insert/update (required fields, email format, RFID UID non-empty, numeric point values). Reject bad payloads early.
- **Hardware:** Treat scanned UIDs as untrusted input; never execute commands based on tag contents; only look up / log known UIDs.
- **Duplicates:** Guard against double-tap spam (e.g., unique constraint or “already checked in for this event” check) when implementing scan logging.
- Fail closed, never fail open.

---

### 8. Grill Me Agent Mode

When the user starts a complex feature **or** says **“grill me”**:

- Interrogate assumptions, edge cases, and data relations before writing code.
- Focus on: RLS/auth boundaries, double-tap / duplicate attendance, inactive vs active events, missing RFID registration, offline ESP/Arduino WiFi failure, clock/`scanned_at` correctness, and who can activate an event.
- Do **not** proceed to large Execute steps until the biggest vulnerabilities/edge cases are acknowledged or deferred explicitly by the Team Lead.

---

### 9. The Council Debate Mode

When the user asks for a high-level technical choice (e.g., Supabase Auth vs open anon + RLS, Retool vs Chart.js-only admin, EEPROM vs cloud-only UID maps, polling vs webhook):

- Simulate a short debate among 5 experts:
  1. Senior Database Administrator
  2. Frontend Performance / Simplicity Specialist
  3. InfoSec Auditor
  4. Product Lead (student-org MVP ship date)
  5. Cynical QA Tester
- Each gives a short conflicting critique from their viewpoint.
- A **Chairman** persona then gives one clear consensus recommendation that favors: shipability for beginners, stack constraints in this file, and security fail-closed defaults.

---

### 10. Always-on Copilot Session Checklist

On every meaningful coding session, the AI should:

1. Confirm the teammate’s **branch + owned files** before editing.
2. Tag/respect `@docs/AI_CODING_SKILLS.md` and **their** `@docs/progress/<branch-file>.md` (not the index, not someone else’s log).
3. Write heavily commented, demo-explainable code.
4. After changes (or before commit/push), **append** a timestamped AI work-log bullet in that progress file (never delete old entries; never write the Human Summary).
