#!/usr/bin/env python3
"""
Tap-In — hardware scan receive stub
Owner: branch-backend-core (Vidhu)

WHAT THIS DOES
--------------
Listens for POST /scan with JSON { "uid": "A1B2C3D4" } (or { "scanned_uid": "..." }),
then calls the Supabase RPC handle_rfid_scan — the same function the admin UI and
frontend helpers use. No Flask/Express; stdlib only so beginners can run it with
`python3 receive_scan.py`.

SETUP
-----
1. cp .env.example .env
2. Put the same SUPABASE_URL + SUPABASE_ANON_KEY as frontend/js/supabase.local.js
3. python3 receive_scan.py
4. curl -X POST http://127.0.0.1:8787/scan -H "Content-Type: application/json" -d '{"uid":"A1B2C3D4"}'

Later: deploy this file (or this folder) on the KTP UGA server and point the Arduino
WiFi client at that host instead of 127.0.0.1.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

# ---------------------------------------------------------------------------
# Config — load backend/.env if present (KEY=value lines, no quotes required)
# ---------------------------------------------------------------------------

HOST = os.environ.get("TAP_IN_HOST", "127.0.0.1")
PORT = int(os.environ.get("TAP_IN_PORT", "8787"))


def load_dotenv(path: Path) -> None:
    """Tiny .env loader so we do not need the python-dotenv package."""
    if not path.is_file():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        # Do not overwrite real environment variables.
        if key and key not in os.environ:
            os.environ[key] = value


load_dotenv(Path(__file__).resolve().parent / ".env")

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")


def call_handle_rfid_scan(scanned_uid: str) -> tuple[int, dict]:
    """
    POST to Supabase REST RPC. Returns (http_status, json_body_or_error_dict).
    """
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return 500, {
            "success": False,
            "status": "misconfigured",
            "message": "Set SUPABASE_URL and SUPABASE_ANON_KEY in backend/.env",
        }

    uid = scanned_uid.strip().upper()
    if not uid:
        return 400, {
            "success": False,
            "status": "invalid_uid",
            "message": "RFID UID is empty.",
        }

    url = f"{SUPABASE_URL}/rest/v1/rpc/handle_rfid_scan"
    payload = json.dumps({"scanned_uid": uid}).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            body = response.read().decode("utf-8")
            data = json.loads(body) if body else {}
            return response.status, data if isinstance(data, dict) else {"data": data}
    except urllib.error.HTTPError as error:
        err_body = error.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(err_body)
        except json.JSONDecodeError:
            parsed = {"message": err_body}
        return error.code, {
            "success": False,
            "status": "rpc_http_error",
            "message": parsed.get("message") or parsed.get("error") or str(error),
            "details": parsed,
        }
    except urllib.error.URLError as error:
        return 502, {
            "success": False,
            "status": "unreachable",
            "message": f"Could not reach Supabase at {SUPABASE_URL}: {error.reason}",
        }


class ScanHandler(BaseHTTPRequestHandler):
    """Minimal HTTP API for the RFID scanner."""

    def _send_json(self, status: int, payload: dict) -> None:
        raw = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        # Allow browser smoke tests from the frontend origin if needed.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(raw)

    def do_OPTIONS(self) -> None:  # noqa: N802 — http.server naming
        self._send_json(204, {})

    def do_GET(self) -> None:  # noqa: N802
        if self.path.rstrip("/") == "/health":
            self._send_json(
                200,
                {
                    "ok": True,
                    "service": "tap-in-receive-scan",
                    "supabase_configured": bool(SUPABASE_URL and SUPABASE_ANON_KEY),
                },
            )
            return
        self._send_json(404, {"success": False, "message": "Not found. Use GET /health or POST /scan."})

    def do_POST(self) -> None:  # noqa: N802
        if self.path.rstrip("/") != "/scan":
            self._send_json(404, {"success": False, "message": "Not found. Use POST /scan."})
            return

        length = int(self.headers.get("Content-Length", "0") or 0)
        raw = self.rfile.read(length) if length > 0 else b"{}"
        try:
            body = json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            self._send_json(400, {"success": False, "message": "Body must be JSON."})
            return

        if not isinstance(body, dict):
            self._send_json(400, {"success": False, "message": "JSON body must be an object."})
            return

        # Accept either key so Arduino / curl / admin-style callers all work.
        uid = body.get("uid") or body.get("scanned_uid") or ""
        if not isinstance(uid, str):
            self._send_json(400, {"success": False, "message": "uid must be a string."})
            return

        status, result = call_handle_rfid_scan(uid)
        # RPC business failures (unknown UID, etc.) still return JSON with success:false
        # from Postgres — surface them as 200 so hardware can read the status field.
        if status == 200:
            self._send_json(200, result if isinstance(result, dict) else {"data": result})
        else:
            self._send_json(status, result)

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        # Clearer console line than the default BaseHTTPRequestHandler format.
        print(f"[tap-in receive] {self.address_string()} - {args[0]}")


def main() -> None:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print(
            "[tap-in receive] WARNING: SUPABASE_URL / SUPABASE_ANON_KEY missing.\n"
            "  Copy backend/.env.example → backend/.env and paste your keys."
        )

    server = ThreadingHTTPServer((HOST, PORT), ScanHandler)
    print(f"[tap-in receive] Listening on http://{HOST}:{PORT}")
    print("[tap-in receive] POST /scan  GET /health")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[tap-in receive] Shutting down.")
        server.server_close()


if __name__ == "__main__":
    main()
