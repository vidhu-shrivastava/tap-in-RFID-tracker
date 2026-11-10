# Hardware tap path (localhost → KTP server later)

How a **UGA OneCard** tap becomes attendance points. Frontend pages and the Arduino share the **same** Postgres function: `handle_rfid_scan` ([`database/rpc_handle_scan.sql`](../database/rpc_handle_scan.sql)).

```text
OneCard → RC522 → Arduino sketch → POST /scan → handle_rfid_scan → attendance_logs + total_points
```

Captured OneCard UIDs from Kathleen’s reader are **7-byte / 14 hex characters**, continuous uppercase, for example:

- `04692602CD1590`
- `04B1BBDAAF1890`

That string is what members bind on `register.html` and what hardware posts as `uid`.

---

## Path A — Admin simulate (works today, no Arduino)

1. Open `http://localhost:5500/admin.html` and unlock.
2. Make sure **exactly one** event is Active.
3. Enter a registered UID (a bound OneCard like `04692602CD1590`, or seed demo UIDs) → **Run scan RPC**.

Same RPC the hardware will call.

---

## Path B — `backend/` receive folder (recommended for hardware + KTP)

Thin Python server in this monorepo ([`backend/receive_scan.py`](../backend/receive_scan.py)):

```bash
cp backend/.env.example backend/.env   # same URL/anon key as frontend
cd backend && python3 receive_scan.py  # http://127.0.0.1:8787
```

Arduino (or curl) posts JSON:

```bash
curl -s -X POST http://127.0.0.1:8787/scan \
  -H "Content-Type: application/json" \
  -d '{"uid":"04692602CD1590"}'
```

Also accepts form-urlencoded `uid=04692602CD1590` for older Arduino sketches.

**Why this folder exists:** on the fraternity server you can host `backend/` as one URL. The sketch only needs that host; secrets stay in `backend/.env` on the server, not burned into firmware.

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
{ "scanned_uid": "04692602CD1590" }
```

Works for quick tests; prefer Path B before production so keys are not in the sketch.

---

## Sketch status

[`hardware/tap_in_scanner/tap_in_scanner.ino`](../hardware/tap_in_scanner/tap_in_scanner.ino) reads OneCard UIDs, shows OLED feedback, and POSTs JSON `{ "uid": "<HEX>" }` to `/scan`.

WiFi / host settings live in gitignored `arduino_secrets.h` (copy from `arduino_secrets.h.example`).

---

## Checklist before a live tap works

1. Run `database/phase3_onecard_admin.sql` once (adds `members.is_admin` so admins can bind real OneCards).
2. Member exists with that `rfid_uid` (`register.html` bind step, dashboard helper, or seed).
3. Exactly one `events.is_active = true` (Admin → Activate).
4. Frontend / backend `.env` / `supabase.local.js` point at the **same cloud** Supabase project (`https://….supabase.co` — no Docker).
5. Double-tap same event returns `already_checked_in` (expected).

---

## One-page demo checklist (seed → points)

1. **SQL once (cloud):** `schema.sql` → `rpc_handle_scan.sql` → `lead_explore_seed.sql` → `phase2_nullable_rfid.sql` → `phase3_onecard_admin.sql`
2. **Keys:** `frontend/js/supabase.local.js` + `backend/.env` + `frontend/js/admin.local.js` point at the same project
3. **Auth demo (optional):** disable Confirm email in Supabase Auth; create account, then bind OneCard UID from Serial
4. **Activate event:** `admin.html` → Chapter admin password → Activate one event
5. **Simulate tap:** Admin “Run scan RPC” with the bound UID **or**  
   `curl -s -X POST http://127.0.0.1:8787/scan -H "Content-Type: application/json" -d '{"uid":"04692602CD1590"}'`  
   (`cd backend && python3 receive_scan.py` first)
6. **Verify points:** `dashboard.html` for that member shows `total_points` + attendance row
7. **Live hardware:** Arduino POSTs `{ "uid": "<HEX>" }` to `/scan`

**Contract (do not change without telling Kathleen):** `POST /scan` JSON `{ "uid": "<HEX>" }` (also accepts `scanned_uid`, and form `uid=`).
