-- Tap-In RFID Attendance Tracker - Supabase PostgreSQL Schema
-- Run this file in the Supabase SQL editor to create the Week 1 tables and sample rows.

-- Members are people who tap in with a registered RFID card.
CREATE TABLE members (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	full_name text NOT NULL,
	email text UNIQUE NOT NULL,
	rfid_uid text UNIQUE NOT NULL,
	total_points int4 NOT NULL DEFAULT 0 CHECK (total_points >= 0)
);

-- Events define when members can earn points.
CREATE TABLE events (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	event_name text NOT NULL,
	event_date date NOT NULL,
	point_value int4 NOT NULL CHECK (point_value >= 0),
	is_active boolean NOT NULL DEFAULT false
);

-- Each member can check in once per event. The foreign keys connect each tap
-- to a real member and event, and the indexes help lookups by either key.
CREATE TABLE attendance_logs (
	id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	member_id uuid NOT NULL REFERENCES members(id),
	event_id uuid NOT NULL REFERENCES events(id),
	scanned_at timestamptz NOT NULL DEFAULT now(),
	UNIQUE (member_id, event_id)
);

CREATE INDEX attendance_logs_member_id_idx ON attendance_logs(member_id);
CREATE INDEX attendance_logs_event_id_idx ON attendance_logs(event_id);

-- Sample member rows use fixed IDs so the attendance examples below can refer
-- to them. The emails use example.org and are not real member addresses.
INSERT INTO members (id, full_name, email, rfid_uid, total_points)
VALUES ('10000000-0000-4000-8000-000000000001', 'Avery Chen', 'avery.chen@example.org', 'A1B2C3D4', 10);

INSERT INTO members (id, full_name, email, rfid_uid, total_points)
VALUES ('10000000-0000-4000-8000-000000000002', 'Jordan Patel', 'jordan.patel@example.org', 'E5F6A7B8', 10);

-- This sample event awards ten points and is active for basic testing.
INSERT INTO events (id, event_name, event_date, point_value, is_active)
VALUES ('20000000-0000-4000-8000-000000000001', 'October General Meeting', '2026-10-21', 10, true);

-- Each sample attendance row references one of the members and the event above.
INSERT INTO attendance_logs (member_id, event_id, scanned_at)
VALUES ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', '2026-10-21 18:05:00+00');

INSERT INTO attendance_logs (member_id, event_id, scanned_at)
VALUES ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', '2026-10-21 18:07:00+00');
