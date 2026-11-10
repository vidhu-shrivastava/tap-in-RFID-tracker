-- =============================================================================
-- Phase 3 follow-up — bind team OneCard UIDs (cloud SQL Editor)
-- Safe to re-run. Leaves Vidhu's ADMIN001 admin card alone.
-- =============================================================================

-- Kathleen / Jayati / Turner / Kailash → real OneCard chip UIDs
UPDATE members SET rfid_uid = '04692602CD1590' WHERE email = 'kathleen.go@uga.edu';
UPDATE members SET rfid_uid = '0465D652FD1890' WHERE email = 'jayati.joshi@uga.edu';
UPDATE members SET rfid_uid = '04537B22F01990' WHERE email = 'turner.crawford@uga.edu';
UPDATE members SET rfid_uid = '043C8CA2A31990' WHERE email = 'kailash.konisetty@uga.edu';

-- Vidhu admin account keeps ADMIN001.
UPDATE members
SET is_admin = true
WHERE email = 'vidhu.shrivastava@uga.edu';

-- Vidhu personal account left unbound so he can demo OneCard bind with:
--   04BE98AA1B1990
-- (Do not re-assign here or the register CTA stays hidden.)
UPDATE members
SET rfid_uid = NULL
WHERE lower(email) = 'vrs97350@uga.edu';
