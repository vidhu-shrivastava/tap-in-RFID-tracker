# Week 1 Plan — Member UI (Turner)

**Branch:** `member-ui` | **Owner:** Turner
**Vibe:** One clear win — build a clean, static frontend for general members to view their points.

---

## 1. The Goal

Build the **static UI** for the member dashboard using **Vanilla HTML** and **Tailwind CSS via CDN**.

By end of Week 1 you should have a **mobile-friendly** page with:

- Profile section
- Points progress bar
- Attendance history table

No Supabase / live data yet — **dummy content is fine**. Style first; wire data later.

---

## 2. File to Edit

Only edit:

```text
frontend/dashboard.html
```

**Stay on `member-ui`.** Do **not** push to `main`. Do **not** edit files outside your Member UI ownership (`frontend/index.html`, `frontend/dashboard.html`, and your progress log).

---

## 3. Step-by-Step Tasks

Check items off as you go.

### HTML boilerplate + Tailwind CDN

- [ ] Keep / add `<!DOCTYPE html>`, `lang="en"`, charset, and viewport meta (mobile-friendly)
- [ ] Include Tailwind via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- [ ] Set a clear page title (e.g. `Tap-In — Member Dashboard`)
- [ ] Use a simple page background and readable text colors with Tailwind utilities

### Top Nav bar

- [ ] Add a top navigation bar (logo / “Tap-In” + simple links)
- [ ] Include a link back to `index.html` (Home)
- [ ] Keep it clean and mobile-friendly (stack or wrap on small screens if needed)

### Points Progress Card

- [ ] Show the member’s **name** (dummy, e.g. “Alex Member”)
- [ ] Show current points vs goal, e.g. **40 / 100**
- [ ] Add a visual **progress bar** whose width matches the percentage (40%)
- [ ] Keep layout simple — one clear card-style section is OK here because it’s interactive reading UI

### Attendance History Table

- [ ] Add a table (or table-like list) titled something like “Attendance History”
- [ ] Columns such as: Date | Event | Points
- [ ] Fill **3 rows of dummy data** so the layout looks real
- [ ] Make it readable on mobile (horizontal scroll OK if needed)

### Smoke check

- [ ] Open `frontend/dashboard.html` in a browser
- [ ] Confirm nav, points bar, and table all look good on desktop and a phone-width window

---

## 4. AI Prompt to Use (GitHub Copilot)

Copy everything in the box below into Copilot Chat. Keep the `@` tags so Copilot follows team rules.

```text
@docs/AI_CODING_SKILLS.md @docs/progress/member-ui.md @frontend/dashboard.html

I am on branch member-ui. Replace the placeholder in frontend/dashboard.html with a clean, beginner-friendly Vanilla HTML + Tailwind CSS (CDN) member dashboard layout.

Requirements:
1. Mobile-friendly HTML boilerplate with Tailwind CDN script.
2. Top nav bar with “Tap-In” branding and a link back to index.html.
3. Profile / points section showing dummy name and points progress (e.g. 40/100) with a visual progress bar at 40%.
4. Attendance history table with exactly 3 rows of dummy data (Date, Event, Points).
5. Vanilla HTML + Tailwind utilities only — no React, no build tools, no Supabase yet (static Week 1 UI only).
6. Keep code simple and lightly commented so a first-year CS student can explain every section.
7. After writing the code, remind me what to log in docs/progress/member-ui.md.

Follow AI_CODING_SKILLS.md. Do not edit files outside my Member UI ownership except my progress log.
```

---

## 5. End of Session

Before you close the laptop, ship your work and leave a trail.

### Git (run in this exact order)

```bash
git branch
git status
git add .
git commit -m "Week 1: static member dashboard UI with points and history"
git push origin member-ui
```

Confirm `*` is on **`member-ui`** before you push. Never push to `main`.

### Progress log

- [ ] Append a **timestamped** entry in **`docs/progress/member-ui.md`**
- [ ] Include: files touched, what you built, and a one-line “how it works”
- [ ] Do **not** edit `docs/PROGRESS_TRACKER.md` (that file is only the index)

Example log bullet:

```markdown
- **2026-10-13 18:00** — Files: `frontend/dashboard.html`.
  Built: static member dashboard (nav, 40/100 points bar, 3-row attendance table).
  How it works: Vanilla HTML + Tailwind CDN; dummy data only for Week 1.
```

---

**Week 1 success = a clean dashboard that looks real with dummy data.** Live points and Supabase can wait. Style it. Open it in the browser. Commit. Done.


**Make sure to check off the boxes with Ai once you are done building features and parts of the frontend**