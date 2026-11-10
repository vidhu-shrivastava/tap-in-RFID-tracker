-- =============================================================================
-- Cloud seed (Vidhu / Team Lead ONLY)
-- Does NOT replace schema.sql or rpc_handle_scan.sql.
-- Run in Supabase SQL Editor AFTER those two files have been applied.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT patterns).
-- =============================================================================

-- Soft-archive column (no-op if schema.sql already included it)
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

-- OneCard admin flag (no-op if phase3_onecard_admin.sql / schema already added it)
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

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

-- Team directory (uga.edu) — real UGA OneCard chip UIDs (14 hex).
-- Vidhu keeps ADMIN001 for the chapter admin account (is_admin = true).
-- Personal OneCard 04BE98AA1B1990 lives on vrs97350@uga.edu (see phase3_onecard_member_uids.sql).
INSERT INTO members (full_name, email, rfid_uid, total_points, is_admin)
VALUES
  ('Vidhu Shrivastava', 'vidhu.shrivastava@uga.edu', 'ADMIN001', 0, true),
  ('Turner Crawford', 'turner.crawford@uga.edu', '04537B22F01990', 0, false),
  ('Kathleen Go', 'kathleen.go@uga.edu', '04692602CD1590', 0, false),
  ('Jayati Joshi', 'jayati.joshi@uga.edu', '0465D652FD1890', 0, false),
  ('Kailash Konisetty', 'kailash.konisetty@uga.edu', '043C8CA2A31990', 0, false)
ON CONFLICT (email) DO UPDATE
SET full_name = EXCLUDED.full_name,
    rfid_uid = EXCLUDED.rfid_uid,
    is_admin = EXCLUDED.is_admin;

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
