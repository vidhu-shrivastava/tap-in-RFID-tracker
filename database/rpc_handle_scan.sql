-- Tap-In RFID Attendance Tracker — Scan RPC
-- Owner branch: branch-backend-core (Vidhu)
--
-- !!! DO NOT DELETE THIS FILE !!!
-- Other branches (esp. db-onboarding) may edit database/schema.sql only.
-- Never remove, rename, or blank this file while working on schema/register —
-- that causes merge conflicts and breaks the RFID scan entrypoint.
-- If schema column names change, ask backend-core to update this RPC — do not delete it.
--
-- Run this in the Supabase SQL Editor AFTER members / events / attendance_logs exist
-- (see database/schema.sql on the db-onboarding branch).
--
-- Call from hardware or frontend:
--   SELECT handle_rfid_scan('A1B2C3D4');
--   -- or via Supabase JS: supabase.rpc('handle_rfid_scan', { scanned_uid: 'A1B2C3D4' })

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
  -- ----------------------------------------------------------
  -- 0) Reject empty / blank UIDs early (untrusted hardware input)
  -- ----------------------------------------------------------
  IF scanned_uid IS NULL OR btrim(scanned_uid) = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'status',  'invalid_uid',
      'message', 'RFID UID is empty.'
    );
  END IF;

  scanned_uid := upper(btrim(scanned_uid));

  -- ----------------------------------------------------------
  -- 1) Look up member_id from members by rfid_uid
  -- ----------------------------------------------------------
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

  -- ----------------------------------------------------------
  -- 2) Find the active event (exactly one is_active = true)
  --    0 active  → fail closed (nothing to check into)
  --    2+ active → fail closed (admin must keep only one live)
  -- ----------------------------------------------------------
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

  -- ----------------------------------------------------------
  -- 3) Duplicate check — same member + same event already logged
  -- ----------------------------------------------------------
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

  -- ----------------------------------------------------------
  -- 4) INSERT attendance_logs row (scanned_at defaults to now())
  -- ----------------------------------------------------------
  INSERT INTO attendance_logs (member_id, event_id)
  VALUES (v_member_id, v_event_id);

  -- ----------------------------------------------------------
  -- 5) Increment members.total_points by the event point_value
  -- ----------------------------------------------------------
  UPDATE members
  SET total_points = total_points + v_point_value
  WHERE id = v_member_id
  RETURNING total_points INTO v_total_points;

  -- ----------------------------------------------------------
  -- 6) Success payload for hardware OLED / frontend feedback
  -- ----------------------------------------------------------
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
