# Backend — hardware scan receive (same GitHub repo)

This folder is a **thin HTTP receiver** for RFID taps. It is **not** a second repository.

The Arduino (or any scanner) POSTs a UID here; this process calls the same Supabase RPC the admin “Test RFID scan” button uses: `handle_rfid_scan`.

```text
RC522 → Arduino → POST /scan { "uid": "A1B2C3D4" } → this server → Supabase RPC → points + attendance
```

Later, KTP UGA can host **this folder** on their private server. Frontend keeps using Supabase JS CDN; hardware hits this URL so long-term keys live on the server, not hard-coded in the sketch.

## Quick start (localhost)

1. Copy env example and paste the **same cloud** URL + anon key as `frontend/js/supabase.local.js` (no Docker):

```bash
cp backend/.env.example backend/.env
# edit backend/.env
```

2. Run the receiver (stdlib HTTP — no Flask). On macOS Python.org builds, install CA certs once if HTTPS to Supabase fails:

```bash
python3 -m pip install certifi   # only if you see CERTIFICATE_VERIFY_FAILED
cd backend
python3 receive_scan.py
```

Default listen: **http://0.0.0.0:8787** (all interfaces — required for hotspot demos).

- Laptop smoke-test still uses `http://127.0.0.1:8787`.
- Arduino must use the **laptop’s hotspot/LAN IP** in `arduino_secrets.h` (e.g. `192.168.43.10`), **not** `127.0.0.1`.

3. Smoke-test without hardware:

```bash
curl -s -X POST http://127.0.0.1:8787/scan \
  -H "Content-Type: application/json" \
  -d '{"uid":"A1B2C3D4"}'
```

You need an **active event** and a registered member with that RFID UID (use Admin or seed data).

### Hotspot demo (USB ≠ data path)

1. Phone or laptop hotspot: put **laptop** and **Arduino UNO R4 WiFi** on the same SSID.
2. USB cable powers the board and opens Serial Monitor for debug only — check-ins go over **WiFi HTTP**, not Serial.
3. `cd backend && python3 receive_scan.py` (prints a guessed LAN IP for `TAP_IN_HOST`).
4. In gitignored `arduino_secrets.h`: hotspot SSID/password + that laptop IP + port `8787`.
5. Activate one event in Admin → tap OneCard → confirm points on the member dashboard.
6. No Arduino? Admin **Simulate OneCard scan** still hits the same `handle_rfid_scan` RPC.

## Endpoints

| Method | Path | Body | Notes |
|--------|------|------|-------|
| `GET` | `/health` | — | Liveness check |
| `POST` | `/scan` | `{ "uid": "A1B2C3D4" }` | Calls `handle_rfid_scan` (contract stable through Phase 2 Auth) |

## Files

| File | Purpose |
|------|---------|
| `receive_scan.py` | HTTP server + Supabase RPC client |
| `.env.example` | Template for URL + anon key |
| `.env` | Real keys (gitignored) |
