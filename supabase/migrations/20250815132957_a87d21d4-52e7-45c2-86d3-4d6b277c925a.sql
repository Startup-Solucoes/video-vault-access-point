-- Correção Final: Remover TODAS as políticas que permitem acesso anônimo

-- 1. PROFILES - Corrigir políticas antigas que ainda existem
DROP POLICY IF EXISTS "Users can view their own profile only" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles safely" ON public.profiles;

-- Recriar apenas para usuários autenticados
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles safely" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (get_current_user_role() = 'admin'::text);

-- 2. STORAGE.OBJECTS - Corrigir políticas de logos que permitem acesso anônimo
DROP POLICY IF EXISTS "Public client logos access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update client logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can manage client logos" ON storage.objects;

-- Recriar políticas de storage apenas para usuários autenticados
CREATE POLICY "Authenticated users can view client logos" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'client-logos');

CREATE POLICY "Authenticated users can update client logos" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'client-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated admins can manage client logos" 
ON storage.objects 
FOR ALL 
TO authenticated 
USING (bucket_id = 'client-logos' AND (
  SELECT role FROM public.profiles WHERE id = auth.uid()
) = 'admin') 
WITH CHECK (bucket_id = 'client-logos' AND (
  SELECT role FROM public.profiles WHERE id = auth.uid()
) = 'admin');

-- Inserção de logos para usuários autenticados
CREATE POLICY "Authenticated users can insert client logos" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'client-logos' AND auth.uid()::text = (storage.foldername(name))[1]);