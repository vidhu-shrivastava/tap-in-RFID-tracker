-- =============================================================================
-- Phase 3 — UGA OneCard readiness
-- Run once in the cloud Supabase SQL Editor (after phase2_nullable_rfid.sql).
-- Safe to re-run.
-- =============================================================================
--
-- Why: Real OneCard UIDs are hex like 04692602CD1590 (7 bytes). They never
-- contain the substring "ADMIN", so admin access must be a real column — not
-- baked into the card UID.
--
-- After this runs:
--   1) Members can bind OneCard UIDs without losing admin.
--   2) isAdminMember() in frontend/js/supabase.js reads members.is_admin
--      (and still accepts legacy UIDs containing "ADMIN").

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- Preserve existing demo admins that used the ADMIN* UID convention.
UPDATE members
SET is_admin = true
WHERE upper(rfid_uid) LIKE '%ADMIN%';

COMMENT ON COLUMN members.is_admin IS
  'Chapter admin flag. Required for OneCards — real UIDs are hex and cannot encode ADMIN.';
