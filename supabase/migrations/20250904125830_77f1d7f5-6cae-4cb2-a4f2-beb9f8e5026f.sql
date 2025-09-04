-- Fortalecer as políticas RLS para garantir que apenas admins possam gerenciar vídeos
-- Atualizar política de criação de vídeos para ser mais específica
DROP POLICY IF EXISTS "Authenticated admins can manage videos" ON public.videos;

CREATE POLICY "Only admins can create videos" 
ON public.videos 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update videos" 
ON public.videos 
FOR UPDATE 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete videos" 
ON public.videos 
FOR DELETE 
TO authenticated 
USING (is_admin());

CREATE POLICY "Authenticated admins can view all videos" 
ON public.videos 
FOR SELECT 
TO authenticated 
USING (is_admin());

-- Manter política para clientes verem apenas vídeos atribuídos
CREATE POLICY "Authenticated clients can view assigned videos" 
ON public.videos 
FOR SELECT 
TO authenticated 
USING (
  NOT is_admin() AND EXISTS (
    SELECT 1 FROM video_permissions 
    WHERE video_permissions.video_id = videos.id 
    AND video_permissions.client_id = auth.uid()
  )
);

-- Fortalecer políticas de video_permissions também
DROP POLICY IF EXISTS "Authenticated admins can manage video permissions" ON public.video_permissions;

CREATE POLICY "Only admins can create video permissions" 
ON public.video_permissions 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update video permissions" 
ON public.video_permissions 
FOR UPDATE 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete video permissions" 
ON public.video_permissions 
FOR DELETE 
TO authenticated 
USING (is_admin());

CREATE POLICY "Admins can view all video permissions" 
ON public.video_permissions 
FOR SELECT 
TO authenticated 
USING (is_admin());

-- Manter política para clientes verem suas próprias permissões
CREATE POLICY "Clients can view their own video permissions" 
ON public.video_permissions 
FOR SELECT 
TO authenticated 
USING (NOT is_admin() AND client_id = auth.uid());