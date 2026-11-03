-- Seeded on `npx supabase db reset` / first start when [db.seed] is enabled.
-- Lead explore account for local smoke tests.

INSERT INTO members (full_name, email, rfid_uid, total_points)
VALUES ('Vidhu Lead (explore)', 'vidhu.lead@tap-in.local', 'LEAD0001', 0)
ON CONFLICT (email) DO NOTHING;

INSERT INTO events (event_name, event_date, point_value, is_active)
SELECT 'Week 2 Planning Smoke Test', CURRENT_DATE, 10, true
WHERE NOT EXISTS (SELECT 1 FROM events WHERE event_name = 'Week 2 Planning Smoke Test');

UPDATE events SET is_active = false WHERE event_name <> 'Week 2 Planning Smoke Test';
UPDATE events SET is_active = true WHERE event_name = 'Week 2 Planning Smoke Test';
