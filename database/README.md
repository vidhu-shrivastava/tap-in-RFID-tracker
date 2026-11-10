# `/database/` — SQL for cloud Supabase

Paste these into the **cloud** Supabase SQL Editor (see `docs/LOCAL_SUPABASE.md`). Do not use Docker.

**MVP status: DONE.** Run the files below once (in order) on a fresh project.

| Order | File | Purpose |
|------:|------|---------|
| 1 | `schema.sql` | Tables: members, events, attendance_logs |
| 2 | `rpc_handle_scan.sql` | `handle_rfid_scan(scanned_uid)` RPC |
| 3 | `lead_explore_seed.sql` | MVP anon RLS + team directory + sample event |
| 4 | `phase2_nullable_rfid.sql` | Allow account signup before OneCard bind (`rfid_uid` nullable) |
| 5 | `phase3_onecard_admin.sql` | Add `members.is_admin` so real OneCard hex UIDs can be used by admins |
| 6 | `phase3_onecard_member_uids.sql` | Set Kathleen / Jayati / Turner / Kailash OneCard UIDs (keeps Vidhu `ADMIN001`) |

Optional / already covered by newer schema+seed:

| File | Purpose |
|------|---------|
| `add_is_archived.sql` | Patch older clouds missing `events.is_archived` |

## Historical ownership (for credit / merge history)

| File | Original owner |
|------|----------------|
| `schema.sql` | Jayati (`branch-db-onboarding`) |
| `rpc_handle_scan.sql` | Vidhu (`branch-backend-core`) |
| `lead_explore_seed.sql` | Vidhu |
| `phase2_nullable_rfid.sql` | Vidhu |
| `add_is_archived.sql` | Vidhu |

## Rules

1. Do not put real Supabase keys in any SQL file.
2. Prefer additive SQL (safe to re-run) when patching production cloud DBs.
3. See also: `docs/AI_CODING_SKILLS.md`, root `README.md`.
