-- Local Supabase migration (mirrors database/schema.sql + database/rpc_handle_scan.sql
-- + MVP anon grants from database/lead_explore_seed.sql).
-- Source of truth for teammates remains the files under /database/.

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

CREATE INDEX attendance_logs_member_id_idx ON attendance_logs (member_id);
CREATE INDEX attendance_logs_event_id_idx ON attendance_logs (event_id);

CREATE UNIQUE INDEX attendance_logs_member_event_uidx
  ON attendance_logs (member_id, event_id);

-- Scan RPC
CREATE OR REPLACE FUNCTION handle_rfid_scan(scanned_uid TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_member_id     UUID;
  v_member_name   TEXT;
  v_total_points  INT4;
  v_event_id      UUID;
  v_event_name    TEXT;
  v_point_value   INT4;
  v_active_count  INT;
  v_already_in    BOOLEAN;
BEGIN
  IF scanned_uid IS NULL OR btrim(scanned_uid) = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'status',  'invalid_uid',
      'message', 'RFID UID is empty.'
    );
  END IF;

  scanned_uid := upper(btrim(scanned_uid));

  SELECT id, full_name, total_points
    INTO v_member_id, v_member_name, v_total_points
  FROM members
  WHERE upper(rfid_uid) = scanned_uid;

  IF v_member_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'status',  'unknown_uid',
      'message', 'No member registered for this RFID UID.'
    );
  END IF;

  SELECT COUNT(*) INTO v_active_count
  FROM events
  WHERE is_active = true;

  IF v_active_count = 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status',  'no_active_event',
      'message', 'No active event. Activate one event before scanning.'
    );
  END IF;

  IF v_active_count > 1 THEN
    RETURN jsonb_build_object(
      'success', false,
      'status',  'multiple_active_events',
      'message', 'More than one event is active. Keep only one active.'
    );
  END IF;

  SELECT id, event_name, point_value
    INTO v_event_id, v_event_name, v_point_value
  FROM events
  WHERE is_active = true
  LIMIT 1;

  SELECT EXISTS (
    SELECT 1
    FROM attendance_logs
    WHERE member_id = v_member_id
      AND event_id = v_event_id
  ) INTO v_already_in;

  IF v_already_in THEN
    RETURN jsonb_build_object(
      'success', false,
      'status',  'already_checked_in',
      'message', 'Member already checked in for this event.',
      'member_id', v_member_id,
      'member_name', v_member_name,
      'event_id', v_event_id,
      'event_name', v_event_name,
      'total_points', v_total_points
    );
  END IF;

  INSERT INTO attendance_logs (member_id, event_id)
  VALUES (v_member_id, v_event_id);

  UPDATE members
  SET total_points = total_points + v_point_value
  WHERE id = v_member_id
  RETURNING total_points INTO v_total_points;

  RETURN jsonb_build_object(
    'success', true,
    'status',  'checked_in',
    'message', 'Check-in recorded.',
    'member_id', v_member_id,
    'member_name', v_member_name,
    'event_id', v_event_id,
    'event_name', v_event_name,
    'points_awarded', v_point_value,
    'total_points', v_total_points
  );
END;
$$;

COMMENT ON FUNCTION handle_rfid_scan(TEXT) IS
  'Single entrypoint for RFID taps: resolve UID → active event → block duplicates → log attendance → award points.';

-- MVP anon access (student-org prototype; tighten later)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_explore_members_all" ON members
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "lead_explore_events_all" ON events
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "lead_explore_logs_all" ON attendance_logs
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON members TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON events TO anon, authenticated;
GRANT SELECT, INSERT ON attendance_logs TO anon, authenticated;
GRANT EXECUTE ON FUNCTION handle_rfid_scan(TEXT) TO anon, authenticated;
