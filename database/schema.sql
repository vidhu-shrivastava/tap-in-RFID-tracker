-- Tap-In RFID Attendance Tracker — Supabase PostgreSQL Schema
-- Owner branch: branch-db-onboarding
-- Placeholder so Git tracks the database/ folder.
-- Expand this file with CREATE TABLE / policies / indexes on your branch.

-- members: people who tap in with RFID cards
-- CREATE TABLE members (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   full_name text NOT NULL,
--   email text UNIQUE NOT NULL,
--   rfid_uid text UNIQUE NOT NULL,
--   total_points int4 NOT NULL DEFAULT 0
-- );

-- events: meetings / activities that award points
-- CREATE TABLE events (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   event_name text NOT NULL,
--   event_date date NOT NULL,
--   point_value int4 NOT NULL,
--   is_active boolean NOT NULL DEFAULT false
-- );

-- attendance_logs: one row per successful tap
-- CREATE TABLE attendance_logs (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   member_id uuid NOT NULL REFERENCES members(id),
--   event_id uuid NOT NULL REFERENCES events(id),
--   scanned_at timestamptz NOT NULL DEFAULT now()
-- );
