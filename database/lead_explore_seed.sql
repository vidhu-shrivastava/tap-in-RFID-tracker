-- =============================================================================
-- Cloud seed (Vidhu / Team Lead ONLY)
-- Does NOT replace schema.sql or rpc_handle_scan.sql.
-- Run in Supabase SQL Editor AFTER those two files have been applied.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT patterns).
-- =============================================================================

-- Soft-archive column (no-op if schema.sql already included it)
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

-- Allow the browser anon key to read/write for MVP smoke tests.
-- (Open on purpose for a student-org prototype — tighten with Auth/RLS later.)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lead_explore_members_all" ON members;
CREATE POLICY "lead_explore_members_all" ON members
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "lead_explore_events_all" ON events;
CREATE POLICY "lead_explore_events_all" ON events
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "lead_explore_logs_all" ON attendance_logs;
CREATE POLICY "lead_explore_logs_all" ON attendance_logs
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON members TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON events TO anon, authenticated;
GRANT SELECT, INSERT ON attendance_logs TO anon, authenticated;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'handle_rfid_scan'
  ) THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION handle_rfid_scan(text) TO anon, authenticated';
  END IF;
END $$;

-- Team directory (uga.edu). UIDs containing "ADMIN" are admin-priority.
INSERT INTO members (full_name, email, rfid_uid, total_points)
VALUES
  ('Vidhu Shrivastava', 'vidhu.shrivastava@uga.edu', 'ADMIN001', 0),
  ('Turner Crawford', 'turner.crawford@uga.edu', 'A1B2C3D4', 0),
  ('Kathleen Go', 'kathleen.go@uga.edu', 'B2C3D4E5', 0),
  ('Jayati Joshi', 'jayati.joshi@uga.edu', 'C3D4E5F6', 0),
  ('Kailash Konisetty', 'kailash.konisetty@uga.edu', 'D4E5F6A7', 0)
ON CONFLICT (email) DO UPDATE
SET full_name = EXCLUDED.full_name,
    rfid_uid = EXCLUDED.rfid_uid;

-- Sample events; keep exactly one active for scan RPC
INSERT INTO events (event_name, event_date, point_value, is_active, is_archived)
SELECT 'Week 2 Planning Smoke Test', CURRENT_DATE, 10, true, false
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Week 2 Planning Smoke Test');

INSERT INTO events (event_name, event_date, point_value, is_active, is_archived)
SELECT 'Welcome Meetup', CURRENT_DATE - 7, 15, false, false
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Welcome Meetup');

INSERT INTO events (event_name, event_date, point_value, is_active, is_archived)
SELECT 'Tech Workshop', CURRENT_DATE - 14, 15, false, false
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Tech Workshop');

-- Exactly one active event (required by handle_rfid_scan)
UPDATE events SET is_active = false WHERE event_name <> 'Week 2 Planning Smoke Test';
UPDATE events
SET is_active = true, is_archived = false
WHERE event_name = 'Week 2 Planning Smoke Test';
