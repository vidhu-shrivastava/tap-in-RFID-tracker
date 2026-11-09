-- =============================================================================
-- Phase 2 (backend-core / Vidhu) — allow account-first signup without RFID
-- =============================================================================
-- Paste into the cloud Supabase SQL Editor AFTER schema.sql.
-- Safe to re-run.
--
-- Product rule: members create an Auth account first, then bind an RFID card
-- from the dashboard. Until a card is bound, rfid_uid stays NULL.
-- Postgres UNIQUE still allows many NULLs, so unbound members do not collide.
--
-- Jayati: when convenient, mirror `rfid_uid text UNIQUE` (nullable) in schema.sql
-- for fresh projects. Existing clouds need this ALTER once.

ALTER TABLE members
  ALTER COLUMN rfid_uid DROP NOT NULL;
