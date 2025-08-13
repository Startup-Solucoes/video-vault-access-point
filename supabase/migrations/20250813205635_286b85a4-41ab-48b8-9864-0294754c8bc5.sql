-- CORREÇÃO FINAL: Remover política pública para client-logos se não necessária
-- Comentar ou remover se logos precisam ser públicos
DROP POLICY IF EXISTS "Anyone can view client logos" ON storage.objects;

-- Se logos realmente precisam ser públicos, manter política específica
-- CREATE POLICY "Public client logos read-only"
-- ON storage.objects
-- FOR SELECT
-- USING (bucket_id = 'client-logos');

-- Limpeza final das políticas duplicadas restantes nos profiles
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile, admins can update all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON public.profiles;

-- Manter apenas as políticas seguras criadas anteriormente
-- (As políticas "Users can view their own profile only", "Admins can view all profiles safely", 
-- "Authenticated users can create their own profile" já existem e são seguras)