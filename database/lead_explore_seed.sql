-- =============================================================================
-- Lead explore seed (Vidhu / Team Lead ONLY)
-- Does NOT replace schema.sql or rpc_handle_scan.sql.
-- Run in Supabase SQL Editor AFTER those two files have been applied.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT patterns).
-- =============================================================================

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

-- Your personal explore member (not a teammate UI change)
INSERT INTO members (full_name, email, rfid_uid, total_points)
VALUES ('Vidhu Lead (explore)', 'vidhu.lead@tap-in.local', 'LEAD0001', 0)
ON CONFLICT (email) DO NOTHING;

-- One sample event so scan smoke tests have somewhere to check in
INSERT INTO events (event_name, event_date, point_value, is_active)
SELECT 'Week 2 Planning Smoke Test', CURRENT_DATE, 10, true
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Week 2 Planning Smoke Test');

-- Keep exactly one active event (this smoke-test event)
UPDATE events SET is_active = false WHERE event_name <> 'Week 2 Planning Smoke Test';
UPDATE events SET is_active = true WHERE event_name = 'Week 2 Planning Smoke Test';
