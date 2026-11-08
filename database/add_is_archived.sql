-- One-time cloud patch (paste in Supabase SQL Editor if archive buttons error).
-- Safe to re-run.
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;
