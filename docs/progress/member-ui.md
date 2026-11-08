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
- **2026-10-26 18:48** — Files: `frontend/index.html`, `frontend/dashboard.html`, `frontend/profile-settings.html`. Built: a coordinated mint and turquoise color scheme across member pages. How it works: soft mint-to-cyan gradients and turquoise borders add accents in light mode, emerald-to-teal buttons and progress indicators strengthen key actions, and dark mode retains its high-contrast slate surfaces.
- **2026-10-26 18:51** — Files: `frontend/dashboard.html`. Built: a green gleam on attendance table headings and the points progress fill. How it works: CSS gradient highlights sweep across the green accents, with animation disabled for visitors who prefer reduced motion.
- **2026-10-26 18:53** — Files: `frontend/dashboard.html`. Built: a slower, less frequent green gleam. How it works: each pass now uses a 10-second cycle and sweeps during only the final 35% of the cycle, leaving a longer pause between passes.
- **2026-10-26 18:54** — Files: `frontend/dashboard.html`. Built: hover-triggered gleam on the attendance headers and points bar. How it works: the sheen stays still until a pointer hovers over an accent, then sweeps once over 1.2 seconds; reduced-motion preferences disable the animation.
- **2026-10-26 19:13** — Files: `frontend/index.html`, `frontend/dashboard.html`, `frontend/profile-settings.html`. Built: a stronger grounded-green visual identity with a presence message on the dashboard. How it works: forest and emerald accents now carry through backgrounds, borders, avatar styling, forms, and attendance components, while turquoise highlights and dark-theme contrast remain intact.
- **2026-10-26 19:16** — Files: `frontend/dashboard.html`. Built: removed the “Your presence matters” badge. How it works: the dashboard greeting now begins directly with the welcome heading while retaining the green visual theme.
- **2026-10-26 19:18** — Files: `frontend/dashboard.html`, `frontend/profile-settings.html`. Built: brighter emerald outlines and subtle green edge glows for dark-mode cards, menus, avatars, progress, and form fields. How it works: dark-mode emerald borders and low-opacity rings/shadows highlight key containers while keeping their slate backgrounds and high-contrast text.
- **2026-10-26 19:25** — Files: `frontend/index.html`, `frontend/dashboard.html`, `frontend/profile-settings.html`. Built: the “Tap-IN” wordmark and a personalized RFID tap logo with a subtle T monogram. How it works: a small inline SVG pairs the T with contactless signal arcs and is reused beside the brand name across the sign-in and member pages.
- **2026-10-26 19:29** — Files: `frontend/dashboard.html`. Built: removed the gleam from attendance table headers while keeping it on the attendance progress bar. How it works: the hover-only sheen CSS now targets only the points fill, and table headings no longer carry gleam styling.
- **2026-10-26 19:35** — Files: `frontend/profile-settings.html`, `frontend/dashboard.html`. Built: made the account name read-only and moved the preferred name into the profile display beside the avatar. How it works: settings shows the stored account name as static text and preserves it when saving; the dashboard uses the preferred name for the profile heading and avatar initials.
- **2026-10-26 19:39** — Files: `frontend/dashboard.html`. Built: removed the preferred-name label and value from beside the profile picture. How it works: the dashboard displays the unchangeable account name beside the avatar and uses it for initials; preferred name remains available for the welcome greeting and profile settings.

### 2. Member Plain-English Summary (Written by Human Only)

<!-- HUMAN ONLY — AI must NEVER write this section. -->

**Instructions:** Periodically read the AI Work Log above, then write a plain-English summary of what you built and how it works — in your own words. Do not copy AI bullets word-for-word.

*(Write your human summary below this line.)*

* WEEK ONE: Created the framework for sign in page. Allows for user to edit profile settings (Name, Preferred name, profile picture), change theme, and view recent attended events and attendance points.