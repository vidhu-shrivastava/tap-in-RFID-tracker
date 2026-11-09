# Phase 2 Plan — Member UI (Turner)

**Branch:** `member-ui` | **Owner:** Turner  
**Vibe:** Polish the member-facing app — real sign-up/sign-in UI, account-then-RFID, theme/logo consistency, and admin only via an admin’s profile menu.

Vidhu owns Auth helpers in `frontend/js/supabase.js` on `backend-core`. You build the pages that call those helpers. Jayati/Kailash → presentation. Kathleen → hardware.

---

## 1. The Goal

By end of Phase 2 you should have:

- Sign-up + sign-in pages with **email + password** (no Google button)
- Account created **first**; RFID card bind is a **one-time** action from the dashboard (option disappears once registered)
- Profile / account menu cleaned up (no double email); **Admin** link only if the signed-in member is admin-designated
- Light/dark + branding aligned with `register.html` (reuse its logo mark)
- Dashboard loading / empty / error states that feel finished

---

## 2. Files to Edit

Only edit these (plus your progress log):

```text
frontend/index.html
frontend/dashboard.html
frontend/profile-settings.html
docs/progress/member-ui.md
```

**Study for theme/logo (read-only):** `frontend/register.html` — match its look; do not take over that file (Jayati owns it).

**Do not edit unless Lead says so:** `frontend/js/supabase.js`, `frontend/admin.html`, `backend/`, `database/`.

**Stay on `member-ui`.** Do **not** push to `main`.

---

## 3. Step-by-Step Tasks

Check items off as you go.

### 0. Branch sync (do this first)

- [ ] Make sure local `member-ui` has the latest Phase 1 wiring from `main`:

```bash
git checkout member-ui
git fetch origin
git merge main
```

- [ ] If GitHub `origin/member-ui` has commits you made that aren’t local yet, merge those too so nothing is lost:

```bash
git merge origin/member-ui
```

Prefer keeping your UI work on conflicts in `index.html` / `dashboard.html` / `profile-settings.html`. Ask Vidhu if a conflict is in `supabase.js` or shared docs.

### 0b. Local secrets (required to run the app — never commit these)

This is a **public** GitHub repo. Real keys are **not** in Git. Vidhu will send you the values **offline** (AirDrop, DM, password manager, etc.).

**What Vidhu sends you (offline only):**

| Value | Used for |
|-------|----------|
| Cloud Supabase **Project URL** (`https://….supabase.co`) | Browser app |
| Cloud Supabase **anon / public** key | Browser app |
| Admin gate password (optional) | Only if you need to open `admin.html` while testing |

**Do not ask for / do not use** the Supabase `service_role` key. You do **not** need `backend/.env` for Member UI work (that’s Vidhu / Kathleen for the scan receiver).

**Setup on your laptop:**

```bash
# 1) Create local files from the tracked examples (examples have placeholders only)
cp frontend/js/supabase.local.js.example frontend/js/supabase.local.js

# 2) Open supabase.local.js and paste the URL + anon key Vidhu sent you
#    Replace YOUR_PROJECT_REF / YOUR_SUPABASE_ANON_KEY — keep the export names the same

# 3) Optional — admin page testing only
cp frontend/js/admin.local.js.example frontend/js/admin.local.js
#    Paste the admin password Vidhu sent into ADMIN_PASSWORD
```

**Safety checklist:**

- [ ] `frontend/js/supabase.local.js` exists locally and is **gitignored** (must **not** appear in `git status` as a file to commit)
- [ ] `frontend/js/admin.local.js` is gitignored if you created it
- [ ] Never paste real keys into `PHASE_2_PLAN.md`, progress logs, HTML, or chat on a public channel
- [ ] If `git status` ever shows `supabase.local.js` or `admin.local.js` as staged — **unstage immediately** (`git restore --staged …`) and fix `.gitignore` with Vidhu before pushing

Then serve the frontend:

```bash
cd frontend
python3 -m http.server 5500
```

Open `http://localhost:5500/index.html`.

### 1. Auth UI — `frontend/index.html`

- [ ] Remove **Sign in with Google** (button + handlers)
- [ ] Enable a real **password** field (required) alongside email
- [ ] Add a clear path to **Create account** / sign-up (same page toggle or linked section) — email + password + name as needed
- [ ] Wire buttons to Vidhu’s helpers from `./js/supabase.js` (he will export sign-up / sign-in; use placeholders/`console` stubs only until those land, then hook them up)
- [ ] Copy should say: register an **account** first; RFID comes later on the dashboard — not “register RFID” as the main CTA on sign-in
- [ ] Reuse the **logo mark** from `register.html`
- [ ] Add the same **light/dark** theme toggle + `tapInTheme` persistence used on dashboard/register

### 2. Dashboard — RFID bind + profile menu — `frontend/dashboard.html`

- [ ] Fix account menu: **do not list email twice** (drop redundant “Signed in as …” if email is already shown, or drop the duplicate line)
- [ ] If member is admin (use helper from `supabase.js`, e.g. `isAdminMember` — ask Vidhu for the exact export): show **Admin** in the profile menu → navigates to `admin.html`
- [ ] If not admin: **no** Admin link
- [ ] **Do not** put a public Admin / “Exec Admin” link on the sign-in page
- [ ] Add a **Register RFID card** entry point (button/section) only when the member has no `rfid_uid` yet
- [ ] Once a card is bound, hide that entry point
- [ ] Loading / empty / error UI when session is missing or Supabase fails
- [ ] Keep theme + logo consistent with register

### 3. Profile settings — `frontend/profile-settings.html`

- [ ] Load the signed-in member’s real name from session (no “Alex Member” default)
- [ ] Preferred name / picture may stay `localStorage` cosmetics for MVP unless Vidhu adds a DB field
- [ ] Match theme/logo with the rest of the app

### 4. Stretch (optional)

- [ ] Replace hardcoded 100-point goal with a named constant at the top of `dashboard.html`
- [ ] Polish empty attendance history copy for new members

### Out of scope for you

| Who | They handle |
|-----|-------------|
| Vidhu | Supabase Auth helpers, RFID bind API helper, admin page theme/chart/exit → dashboard, RLS timing, `backend/` for Kathleen |
| Kathleen | Arduino WiFi POST + OLED + buzzer |
| Jayati / Kailash | Presentation — no new coding unless demo-blocking |

---

## 4. AI Prompt to Use (Cursor)

Copy into Cursor Chat. Keep the `@` tags.

```text
@docs/AI_CODING_SKILLS.md @docs/progress/member-ui.md @PHASE_2_PLAN.md @frontend/index.html @frontend/dashboard.html @frontend/profile-settings.html @frontend/register.html

I am on branch member-ui. Help me with Phase 2 Member UI tasks from PHASE_2_PLAN.md.

Requirements:
1. Password sign-up/sign-in UI (no Google). Account first; RFID bind from dashboard only, hidden once registered.
2. Match theme/logo from register.html; dark mode on index.html.
3. Profile menu: fix double email; Admin link only for admin members.
4. Profile settings: real session name, no Alex Member default.
5. Only edit my owned files + docs/progress/member-ui.md.
6. Import helpers from ./js/supabase.js — do not put secrets in HTML.
7. After changes, remind me what to append to docs/progress/member-ui.md.

Follow AI_CODING_SKILLS.md. Stay on member-ui. Never push to main.
```

---

## 5. End of Session

### Git (run in this exact order)

```bash
git branch                        # confirm * member-ui
git status                        # supabase.local.js / admin.local.js must NOT be listed to commit
git add frontend/index.html frontend/dashboard.html frontend/profile-settings.html docs/progress/member-ui.md
git commit -m "Phase 2: member auth UI + dashboard RFID entry"
git push origin member-ui
```

Confirm `*` is on **`member-ui`** before you push. Never push to `main`. Never force-add gitignored secret files.

### Progress log

- [ ] Append a **timestamped** entry in `docs/progress/member-ui.md`
- [ ] Include: files touched, what you built, one-line how it works
- [ ] Do **not** edit `docs/PROGRESS_TRACKER.md` (index only)

Example:

```markdown
- **2026-11-08 18:00** — Files: `frontend/index.html`, `frontend/dashboard.html`.
  Built: password sign-in/up UI; RFID register CTA on dashboard that hides when bound; Admin link only for admins.
  How it works: pages call supabase.js Auth helpers; dashboard reads member.rfid_uid to toggle the bind UI.
```

---

**Phase 2 success (Turner) = members can create an account with a password, bind a card once from the dashboard, see a clean themed UI, and admins reach admin only from the profile menu.**
