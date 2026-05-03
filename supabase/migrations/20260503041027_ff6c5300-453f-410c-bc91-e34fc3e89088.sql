
-- Fix mutable search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Revoke execute on SECURITY DEFINER functions from public roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role still needs to be callable from RLS policies (runs as the policy's role); keep authenticated execute
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
