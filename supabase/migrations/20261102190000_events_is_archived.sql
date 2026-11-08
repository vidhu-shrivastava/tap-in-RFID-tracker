-- Soft-archive for finished events (admin deactivate / archive flow).
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;
