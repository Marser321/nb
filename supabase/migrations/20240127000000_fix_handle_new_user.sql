-- =====================================================
-- MIGRATION: Fix handle_new_user for Phone Auth
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
    auth_user_id, 
    full_name, 
    phone, 
    role, 
    created_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario Nuevo'),
    COALESCE(new.phone, new.raw_user_meta_data->>'phone'),
    CASE
      WHEN new.email = 'admin@nbbarber.com' THEN 'admin'::user_role
      ELSE 'cliente'::user_role
    END,
    now()
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    phone = EXCLUDED.phone,
    role = CASE 
      WHEN new.email = 'admin@nbbarber.com' THEN 'admin'::user_role 
      ELSE EXCLUDED.role 
    END;
  RETURN new;
END;
$function$;

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
