# Hardware tap path (localhost → KTP server later)

How an RFID card tap becomes attendance points. Frontend pages and the Arduino share the **same** Postgres function: `handle_rfid_scan` ([`database/rpc_handle_scan.sql`](../database/rpc_handle_scan.sql)).

```text
Card → RC522 → Arduino sketch → (choose one path below) → handle_rfid_scan → attendance_logs + total_points
```

---

## Path A — Admin simulate (works today, no Arduino)

1. Open `http://localhost:5500/admin.html` and unlock.
2. Make sure **exactly one** event is Active.
3. Enter a registered UID (seed examples: `ADMIN001`, `A1B2C3D4`) → **Run scan RPC**.

Same RPC the hardware will call.

---

## Path B — `backend/` receive folder (recommended for hardware + KTP)

Thin Python server in this monorepo ([`backend/receive_scan.py`](../backend/receive_scan.py)):

```bash
cp backend/.env.example backend/.env   # same URL/anon key as frontend
cd backend && python3 receive_scan.py  # http://127.0.0.1:8787
```

Arduino (or curl) posts:

```bash
curl -s -X POST http://127.0.0.1:8787/scan \
  -H "Content-Type: application/json" \
  -d '{"uid":"A1B2C3D4"}'
```

**Why this folder exists:** on the fraternity server you can host `backend/` as one URL. The sketch only needs that URL; secrets stay in `backend/.env` on the server, not burned into firmware.

---

## Path C — Arduino → Supabase REST directly (optional)

UNO R4 WiFi can `POST` straight to:

`{SUPABASE_URL}/rest/v1/rpc/handle_rfid_scan`

Headers:

- `apikey: <anon key>`
- `Authorization: Bearer <anon key>`
- `Content-Type: application/json`

Body:

```json
{ "scanned_uid": "A1B2C3D4" }
```

Works for quick tests; prefer Path B before production so keys are not in the sketch.

---

## Sketch status

[`hardware/tap_in_scanner/tap_in_scanner.ino`](../hardware/tap_in_scanner/tap_in_scanner.ino) currently reads the UID over Serial (Week‑1 hardware work). WiFi HTTP POST hooks go in that file next — see the comment block at the top of the sketch.

---

## Checklist before a live tap works

1. Member exists with that `rfid_uid` (`register.html` bind step, dashboard helper, or seed).
2. Exactly one `events.is_active = true` (Admin → Activate).
3. Frontend / backend `.env` / `supabase.local.js` point at the **same cloud** Supabase project (`https://….supabase.co` — no Docker).
4. Double-tap same event returns `already_checked_in` (expected).

---

## One-page demo checklist (seed → points)

Use this order for a dry run before Arduino WiFi is ready:

1. **SQL once (cloud):** `schema.sql` → `rpc_handle_scan.sql` → `lead_explore_seed.sql` → `phase2_nullable_rfid.sql`
2. **Keys:** `frontend/js/supabase.local.js` + `backend/.env` + `frontend/js/admin.local.js` (all gitignored) point at the same project
3. **Auth demo (optional):** disable Confirm email in Supabase Auth; create account on `register.html` (password) or use a seeded email after Auth signup
4. **Activate event:** `admin.html` → Chapter admin password → Activate one event
5. **Simulate tap:** Admin “Run scan RPC” with a seeded UID (`ADMIN001`, `A1B2C3D4`) **or**  
   `curl -s -X POST http://127.0.0.1:8787/scan -H "Content-Type: application/json" -d '{"uid":"A1B2C3D4"}'`  
   (`cd backend && python3 receive_scan.py` first)
6. **Verify points:** `dashboard.html` for that member shows `total_points` + attendance row
7. **Later:** Kathleen’s Arduino POSTs the same `{ "uid": "<HEX>" }` body to `/scan` — contract stays stable

**Contract (do not change without telling Kathleen):** `POST /scan` JSON `{ "uid": "<HEX>" }` (also accepts `scanned_uid`).
