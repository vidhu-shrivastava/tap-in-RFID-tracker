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

2. Run the receiver (stdlib only — no pip install):

```bash
cd backend
python3 receive_scan.py
```

Default listen: **http://127.0.0.1:8787**

3. Smoke-test without hardware:

```bash
curl -s -X POST http://127.0.0.1:8787/scan \
  -H "Content-Type: application/json" \
  -d '{"uid":"A1B2C3D4"}'
```

You need an **active event** and a registered member with that RFID UID (use Admin or seed data).

## Endpoints

| Method | Path | Body | Notes |
|--------|------|------|-------|
| `GET` | `/health` | — | Liveness check |
| `POST` | `/scan` | `{ "uid": "A1B2C3D4" }` | Calls `handle_rfid_scan` |

## Files

| File | Purpose |
|------|---------|
| `receive_scan.py` | HTTP server + Supabase RPC client |
| `.env.example` | Template for URL + anon key |
| `.env` | Real keys (gitignored) |
