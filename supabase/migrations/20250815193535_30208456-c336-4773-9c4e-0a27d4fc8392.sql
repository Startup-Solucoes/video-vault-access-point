-- Criar políticas RLS de UPDATE para a tabela profiles
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Script para recuperar logos perdidas
-- Buscar perfis que podem ter logos no storage mas logo_url NULL
UPDATE public.profiles 
SET logo_url = (
  SELECT 'https://rgdrbimchwxbfyourqgy.supabase.co/storage/v1/object/public/client-logos/' || name
  FROM storage.objects 
  WHERE bucket_id = 'client-logos' 
  AND name LIKE profiles.id::text || '%'
  LIMIT 1
)
WHERE logo_url IS NULL 
AND EXISTS (
  SELECT 1 FROM storage.objects 
  WHERE bucket_id = 'client-logos' 
  AND name LIKE profiles.id::text || '%'
);