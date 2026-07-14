
-- Restrict has_role execution to server-side only
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

-- Replace permissive insert policy with concrete field checks
DROP POLICY IF EXISTS "Anyone can enter the giveaway" ON public.giveaway_entries;
CREATE POLICY "Anyone can enter the giveaway"
  ON public.giveaway_entries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent = true
    AND length(trim(first_name)) BETWEEN 1 AND 100
    AND length(trim(last_name)) BETWEEN 1 AND 100
    AND length(trim(email)) BETWEEN 3 AND 255
    AND email LIKE '%_@_%.__%'
  );
