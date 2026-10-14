# Week 1 Plan — Admin Analytics (Kailash)

**Branch:** `admin-analytics` | **Owner:** Kailash 
**Vibe:** Build the exec board's command center with visual data.

---

## 1. The Goal

Build the **static layout** for the Executive Board admin panel, including:

- An **Event Manager** form
- A **Chart.js** graph with dummy attendance data

No live Supabase yet — static UI + a working chart is the Week 1 win.

---

## 2. File to Edit

Only edit:

```text
frontend/admin.html
```

**Stay on `admin-analytics`.** Do **not** push to `main`. Do **not** edit files outside Admin Analytics ownership (`frontend/admin.html` and your progress log).

---

## 3. Step-by-Step Tasks

Check items off as you go.

### Setup HTML with Tailwind + Chart.js CDNs

- [x] Keep / add HTML boilerplate (`DOCTYPE`, charset, viewport, title)
- [x] Include **Tailwind CSS via CDN**: `<script src="https://cdn.tailwindcss.com"></script>`
- [x] Uncomment / add **Chart.js via CDN**: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
- [x] Use a clean page layout (title like “Exec Admin Dashboard” + short subtitle)

### Top section — Event Manager form

- [x] Add a clear “Event Manager” heading
- [ ] Build a form with fields for:
  - [x] **Name** (event name)
  - [x] **Date**
  - [x] **Point Value**
  - [x] **Active** toggle (checkbox or switch-style control)
- [x] Add a Submit / Save button
- [x] For Week 1: `preventDefault` on submit is OK — **static form only** (no live DB write yet)

### Bottom section — Chart.js bar chart

- [x] Add a `<canvas>` element for the chart (give it an `id`, e.g. `attendanceChart`)
- [x] Write a small Vanilla JS script that initializes a **Chart.js bar chart**
- [x] Feed it **dummy attendance data** (e.g. labels = event names, values = attendance counts)
- [x] Confirm the chart renders when you open `frontend/admin.html` in a browser
- [x] Quick mobile-width check so the canvas doesn’t overflow awkwardly

---

## 4. AI Prompt to Use (GitHub Copilot)

Copy everything in the box below into Copilot Chat. Keep the `@` tags so Copilot follows team rules.

```text
@docs/AI_CODING_SKILLS.md @docs/progress/admin-analytics.md @frontend/admin.html

I am on branch admin-analytics. Replace the placeholder in frontend/admin.html with a clean, beginner-friendly Vanilla HTML + Tailwind CDN + Chart.js CDN exec admin layout.

Requirements:
1. Include Tailwind CDN and Chart.js CDN in the head.
2. Top section: Event Manager form with inputs for Name, Date, Point Value, and an Active toggle, plus a Submit button. Static only for Week 1 (preventDefault is fine; no Supabase yet).
3. Bottom section: a canvas element and a Chart.js bar chart initialized with dummy attendance data (labels + counts).
4. Keep code simple and lightly commented so an MIS student can explain every section.
5. After writing the code, remind me what to log in docs/progress/admin-analytics.md.

Follow AI_CODING_SKILLS.md. Do not edit files outside my Admin Analytics ownership except my progress log.
```

---

## 5. End of Session

Before you close the laptop, ship your work and leave a trail.

### Git (run in this exact order)

```bash
git branch
git status
git add .
git commit -m "Week 1: admin event form + Chart.js attendance chart"
git push origin admin-analytics
```

Confirm `*` is on **`admin-analytics`** before you push. Never push to `main`.

### Progress log

- [ ] Append a **timestamped** entry in **`docs/progress/admin-analytics.md`**
- [ ] Include: files touched, what you built, and a one-line “how it works”
- [ ] Do **not** edit `docs/PROGRESS_TRACKER.md` (that file is only the index)

Example log bullet:

```markdown
- **2026-10-13 18:00** — Files: `frontend/admin.html`.
  Built: Event Manager form (name/date/points/active) + Chart.js bar chart with dummy attendance.
  How it works: Tailwind CDN layout; Chart.js reads hard-coded labels/data into a canvas bar chart.
```

---

**Week 1 success = a clear event form + a visible bar chart.** Live data and Supabase can wait. Layout it. See the chart. Commit. Done.


**Make sure to have Ai check off boxes in this file when you complete tasks or features for your branch**