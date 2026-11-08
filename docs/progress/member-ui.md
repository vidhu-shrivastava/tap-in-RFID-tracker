# ============================================================================
# STRICT AI INSTRUCTIONS — READ THIS FIRST (GitHub Copilot / AI Chatbot)
# ============================================================================
#
# This file is the progress log for branch `branch-member-ui` ONLY.
# Append timestamped bullets here. NEVER edit other files under docs/progress/.
#
# WHEN THIS TEAMMATE FINISHES A SESSION OR IS READY TO COMMIT / PUSH:
# 1. APPEND a timestamped entry (YYYY-MM-DD HH:MM) under the AI Work Log.
# 2. Each bullet MUST list: (1) files modified/created, (2) features built,
#    (3) brief under-the-hood explanation.
# 3. NEVER delete, overwrite, or reorder past AI log entries.
# 4. NEVER write the "Member Plain-English Summary" — humans only.
# 5. Newest entries go at the BOTTOM of the AI Work Log.
#
# Example:
# - **2026-10-12 21:15** — Files: `frontend/dashboard.html`. Built: points card.
#   How it works: fetches total_points and renders a Tailwind div.
# ============================================================================

# Progress — Member UI

**Name:** Turner  
**Role:** CS 1st Year — Member Frontend  
**Branch:** `branch-member-ui`  
**Owns:** `frontend/index.html`, `frontend/dashboard.html` (and this progress file only under docs)  
**Copilot tags:** `@docs/AI_CODING_SKILLS.md` `@docs/progress/member-ui.md`

---

### 1. Automated AI Work Log (Timestamped by AI on each work session/push)

<!-- AI: append new bullets below. Do not delete older entries. -->

- **2026-10-12 22:53** — Files: `frontend/index.html`. Built: a responsive sign-in card with the app title, accessible email field, Sign In button, and Google sign-in button. How it works: Tailwind CDN utility classes center and style the semantic HTML elements responsively; button actions are presentation-only and are not connected to authentication.
- **2026-10-12 23:10** — Files: `frontend/index.html`. Built: a labeled password input on the sign-in card. How it works: a native password input masks typed characters and uses `autocomplete="current-password"`; Tailwind classes match the email field's responsive appearance.
- **2026-10-14 16:34** — Files: `frontend/dashboard.html`. Built: a responsive member profile card with 40/100 attendance points and a three-row history table. How it works: semantic HTML and Tailwind CDN utilities lay out static sample data, with an accessible progress indicator and horizontally scrollable history on narrow screens.
- **2026-10-14 16:39** — Files: `frontend/dashboard.html`. Built: exact sample scan timestamps and a top-right account menu with sign-out and light/dark mode options. How it works: semantic `<time>` elements include ISO timestamps with timezone offsets; vanilla JavaScript toggles the menu and the Tailwind dark theme, with Escape and outside-click dismissal.
- **2026-10-14 16:43** — Files: `frontend/dashboard.html`. Built: a 1.5-second theme color fade and profile settings for profile picture, profile name, and preferred name. How it works: a CSS transition animates page color changes, and vanilla form handlers validate image selection and update the displayed profile for the current page session.
- **2026-10-14 16:55** — Files: `frontend/dashboard.html`, `frontend/profile-settings.html`. Built: profile settings navigation in the account menu and a separate profile editing page with “Exit without Saving” and “Save and Exit” actions. How it works: edits remain on the settings page until confirmed; saved names and image data are stored in browser local storage and loaded into the dashboard, while exit without saving navigates away without changing saved data.
- **2026-10-14 17:02** — Files: `frontend/dashboard.html`. Built: readable event names in both dashboard themes. How it works: attendance event labels use explicit light and dark text colors, matching the rest of the theme-aware dashboard.

### 2. Member Plain-English Summary (Written by Human Only)

<!-- HUMAN ONLY — AI must NEVER write this section. -->

**Instructions:** Periodically read the AI Work Log above, then write a plain-English summary of what you built and how it works — in your own words. Do not copy AI bullets word-for-word.

*(Write your human summary below this line.)*
