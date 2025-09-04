-- Remover todas as políticas existentes e recriá-las de forma mais segura
DROP POLICY IF EXISTS "Authenticated admins can manage videos" ON public.videos;
DROP POLICY IF EXISTS "Authenticated clients can view assigned videos" ON public.videos;
DROP POLICY IF EXISTS "Only admins can create videos" ON public.videos;
DROP POLICY IF EXISTS "Only admins can update videos" ON public.videos;
DROP POLICY IF EXISTS "Only admins can delete videos" ON public.videos;
DROP POLICY IF EXISTS "Authenticated admins can view all videos" ON public.videos;

-- Criar políticas específicas para vídeos
CREATE POLICY "admins_can_create_videos" 
ON public.videos 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin());

CREATE POLICY "admins_can_update_videos" 
ON public.videos 
FOR UPDATE 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "admins_can_delete_videos" 
ON public.videos 
FOR DELETE 
TO authenticated 
USING (is_admin());

CREATE POLICY "admins_can_view_all_videos" 
ON public.videos 
FOR SELECT 
TO authenticated 
USING (is_admin());

CREATE POLICY "clients_can_view_assigned_videos" 
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

-- Remover e recriar políticas de video_permissions
DROP POLICY IF EXISTS "Authenticated admins can manage video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Authenticated clients can view their video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.video_permissions;
DROP POLICY IF EXISTS "Only admins can create video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Only admins can update video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Only admins can delete video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Admins can view all video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Clients can view their own video permissions" ON public.video_permissions;

CREATE POLICY "admins_can_create_video_permissions" 
ON public.video_permissions 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin());

CREATE POLICY "admins_can_update_video_permissions" 
ON public.video_permissions 
FOR UPDATE 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "admins_can_delete_video_permissions" 
ON public.video_permissions 
FOR DELETE 
TO authenticated 
USING (is_admin());

CREATE POLICY "admins_can_view_all_video_permissions" 
ON public.video_permissions 
FOR SELECT 
TO authenticated 
USING (is_admin());

CREATE POLICY "clients_can_view_own_video_permissions" 
ON public.video_permissions 
FOR SELECT 
TO authenticated 
USING (NOT is_admin() AND client_id = auth.uid());