-- Correção Final das Políticas de Storage e Funções

-- 1. REMOVER políticas problemáticas de storage
DROP POLICY IF EXISTS "Admins can upload client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload client logos" ON storage.objects;

-- 2. Corrigir search_path nas funções existentes
ALTER FUNCTION public.is_admin() SET search_path = 'public';
ALTER FUNCTION public.get_current_user_role() SET search_path = 'public';

-- 3. Remover política duplicada no profiles
DROP POLICY IF EXISTS "Authenticated users can create their own profile" ON public.profiles;