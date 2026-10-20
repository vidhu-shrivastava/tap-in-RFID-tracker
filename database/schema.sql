-- Tap-In RFID Attendance Tracker — Supabase PostgreSQL Schema
-- Owner branch: branch-db-onboarding (Jayati edit THIS file)
--
-- !!! MERGE-SAFE RULE FOR EVERYONE IN /database/ !!!
-- - Edit ONLY the file(s) your branch owns.
-- - Do NOT delete, rename, or empty OTHER files in this folder
--   (especially database/rpc_handle_scan.sql — owned by branch-backend-core / Vidhu).
-- - Deleting a sibling file on your branch causes messy merge conflicts into main.
-- - If you need a change in someone else's SQL file, ask the owner or the Team Lead.
--
-- Paste this whole file into the Supabase SQL Editor (run once on a fresh project).

-- members: people who tap in with RFID cards
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  rfid_uid text UNIQUE NOT NULL,
  total_points int4 NOT NULL DEFAULT 0
);

-- events: meetings / activities that award points
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_date date NOT NULL,
  point_value int4 NOT NULL,
  is_active boolean NOT NULL DEFAULT false
);

-- attendance_logs: one row per successful tap
CREATE TABLE attendance_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES members(id),
  event_id uuid NOT NULL REFERENCES events(id),
  scanned_at timestamptz NOT NULL DEFAULT now()
);

-- FK indexes (faster lookups + joins)
CREATE INDEX attendance_logs_member_id_idx ON attendance_logs (member_id);
CREATE INDEX attendance_logs_event_id_idx ON attendance_logs (event_id);

-- One check-in per member per event (blocks double-taps at the DB level too)
CREATE UNIQUE INDEX attendance_logs_member_event_uidx
  ON attendance_logs (member_id, event_id);
