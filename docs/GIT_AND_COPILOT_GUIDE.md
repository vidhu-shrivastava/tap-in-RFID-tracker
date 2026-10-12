# Git & GitHub Copilot Guide — Tap-In RFID Attendance Tracker

Welcome! This guide is written for our 5-person SWE MVP team. If you are new to Git that is okay. Follow these rules in order and you will be locked in for this project.

---

## Rule #1: STAY ON YOUR OWN BRANCH

**This is the most important rule in the entire project.**

Once you are assigned to a branch and you switch to it, you must:

1. **Stay on that branch while working.**
2. **NEVER push to `main`.** `main` is protected. 
3. **Try not to switch branches** unless needed and explained to the team.
4. **Don't edit files outside your assigned folders.** Wait for a merge if you need someone else's work.

### Your Assigned Branches

| Branch | Who | What you own (ONLY edit these) | Your progress file |
|--------|-----|--------------------------------|--------------------|
| `branch-backend-core` | Vidhu | `frontend/js/supabase.js`, shared docs guides, backend logic | `docs/progress/backend-core.md` |
| `branch-hardware` | Kathleen | `/hardware/` | `docs/progress/hardware.md` |
| `branch-member-ui` | Turner | `frontend/index.html`, `frontend/dashboard.html` | `docs/progress/member-ui.md` |
| `branch-db-onboarding` | Jayati/Kailash | `/database/schema.sql`, `frontend/register.html` | `docs/progress/db-onboarding.md` |
| `branch-admin-analytics` | Jayati/Kailash | `frontend/admin.html` | `docs/progress/admin-analytics.md` |

**Important:** Everyone has a **separate** progress file so merges into `main` do not conflict. Do **not** edit `docs/PROGRESS_TRACKER.md` (that is only an index). Do **not** edit anyone else’s `docs/progress/` file.

If you are unsure which branch you are on, run `git branch` and look for the green asterisk `*`. If it is not on YOUR branch name above, **run git checkout YOUR_BRANCH_NAME.**

---

## Essential Git Commands Cheat Sheet

Run these in the **VS Code Terminal** (View → Terminal, or `` Ctrl+` `` / `` Cmd+` ``).

### Exact order for a brand-new start (first time setup)

```text
1. git clone <repo-url>
2. cd tap-in-RFID-tracker
3. git checkout <your-branch-name>
4. git branch          ← confirm * is on YOUR branch
```

### Exact order every time you work and save (after setup)

```text
1. git branch          ← ALWAYS check first — * must be on YOUR branch
2. git status          ← see what you changed
3. git add .
4. git commit -m "clear message about what you did"
5. git push origin <your-branch-name>
```

### What each command means

| Command | What it does |
|---------|----------------|
| `git clone <repo-url>` | **One-time download** of the whole project onto your computer. You only do this once. |
| `git checkout <branch-name>` | **Switch to your assigned branch.** Run this **ONCE** after cloning. Example: `git checkout branch-member-ui` |
| `git branch` | **Shows all local branches.** Run this **first every time you open VS Code.** The green asterisk `*` must be next to YOUR branch. |
| `git status` | **Lists which files you modified** before you save a snapshot. Good habit before every commit. |
| `git add .` | **Stage all your changes** (tell Git: "these files are ready to save"). The `.` means everything in the current folder. |
| `git commit -m "clear message about what you did"` | **Save a snapshot** of your staged changes with a short note. Example: `git commit -m "Add member points display on dashboard"` |
| `git push origin <branch-name>` | **Upload your work to GitHub on YOUR branch.** Replace `<branch-name>` with your real branch (e.g. `branch-hardware`). **Never push to `main`!** |
| `git pull origin <branch-name>` | **Download the latest updates** on your branch from GitHub (if the Team Lead or you pushed from another computer). |

### Push examples (copy yours exactly)

```bash
# Team Lead
git push origin branch-backend-core

# CompE Major
git push origin branch-hardware

# CS 1st Year
git push origin branch-member-ui

# MIS Major #1
git push origin branch-db-onboarding

# MIS Major #2
git push origin branch-admin-analytics
```

---

## How to Use GitHub Copilot in VS Code

### Open the Copilot Chat panel

1. Make sure you are signed into GitHub in VS Code and have Copilot enabled.
2. Open **GitHub Copilot Chat**:
   - Click the Copilot Chat icon in the Activity Bar (left side), **or**
   - Use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → type `GitHub Copilot: Open Chat` → Enter.
3. Type your question in the chat box and send it.

### CRITICAL TIP — Using `@` (or `#file`) to Tag Files

**Copilot does NOT automatically read our project rules.** You must tag the files in chat every time.

Whenever you prompt Copilot, **ALWAYS** include:

1. `@docs/AI_CODING_SKILLS.md` — our coding rules and tech stack
2. **Your** progress file (e.g. `@docs/progress/member-ui.md`) — so Copilot updates **your** work log only
3. The specific file you are editing (e.g. `@frontend/dashboard.html`)

**Good example prompt:**

> `@docs/AI_CODING_SKILLS.md` `@docs/progress/member-ui.md` `@frontend/dashboard.html`
> Add a section that shows the logged-in member's total points. Keep it vanilla HTML/JS and Tailwind CDN only. Add clear comments and explain how it works in simple terms.

**Bad example (too vague — Copilot will guess and may break our stack):**

> Make a dashboard with React.

### You must understand your own code

AI can write all the code, but **every team member is required to understand and explain what their code does** in a demo or check-in.

After Copilot writes something, always ask:

> Add clear comments to this code and explain how it works in simple terms.

Then read the explanation. If you cannot explain a line out loud, ask Copilot again until you can.

### Reminder: update the progress tracker

When you finish a coding session (or before you commit/push), ask Copilot:

> Update the AI Work Log in `@docs/progress/member-ui.md` (use YOUR progress file) with a timestamped entry for what I just did. Do not delete old entries. Do not write the Human Summary section. Do not edit the progress index or anyone else's progress file.

---

## Quick "I'm stuck" checklist

1. Run `git branch` — is `*` on YOUR branch?
2. Did you only edit YOUR assigned files?
3. Did you tag `@docs/AI_CODING_SKILLS.md` and **your** `@docs/progress/...` file in Copilot?
4. Still stuck? Message Vidhu - I can help with most things and I reply relatively quickly as long as you message me on iMessage

---

*Questions about Git or Copilot? Google it... you guys are smart.*
