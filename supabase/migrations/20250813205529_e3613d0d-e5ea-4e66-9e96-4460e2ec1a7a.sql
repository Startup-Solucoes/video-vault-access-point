-- CORREÇÃO CRÍTICA DE SEGURANÇA: Remover acesso anônimo de todas as tabelas
-- Todas as políticas devem requerer autenticação

-- 1. ADVERTISEMENTS - Remover políticas que permitem acesso anônimo
DROP POLICY IF EXISTS "Admins can manage advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Admins can manage all advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Clients can view active advertisements" ON public.advertisements;

-- Recrear políticas seguras para advertisements
CREATE POLICY "Authenticated admins can manage advertisements"
ON public.advertisements
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Authenticated clients can view active advertisements"
ON public.advertisements
FOR SELECT
TO authenticated
USING (is_active = true AND NOT is_admin());

-- 2. ADVERTISEMENT_PERMISSIONS - Remover políticas anônimas
DROP POLICY IF EXISTS "Admins can manage advertisement permissions" ON public.advertisement_permissions;
DROP POLICY IF EXISTS "Clients can view their advertisement permissions" ON public.advertisement_permissions;
DROP POLICY IF EXISTS "Only admins can manage advertisement permissions" ON public.advertisement_permissions;

-- Recrear políticas seguras para advertisement_permissions
CREATE POLICY "Authenticated admins can manage advertisement permissions"
ON public.advertisement_permissions
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Authenticated clients can view their advertisement permissions"
ON public.advertisement_permissions
FOR SELECT
TO authenticated
USING (client_id = auth.uid());

-- 3. CLIENT_USERS - Remover políticas anônimas
DROP POLICY IF EXISTS "Admins can delete client users" ON public.client_users;
DROP POLICY IF EXISTS "Admins can insert client users" ON public.client_users;
DROP POLICY IF EXISTS "Admins can update client users" ON public.client_users;
DROP POLICY IF EXISTS "Admins can view all client users" ON public.client_users;
DROP POLICY IF EXISTS "Only admins can manage client users" ON public.client_users;
DROP POLICY IF EXISTS "client_users_manage_admin" ON public.client_users;

-- Recrear políticas seguras para client_users
CREATE POLICY "Authenticated admins can manage client users"
ON public.client_users
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 4. VIDEO_PERMISSIONS - Remover políticas anônimas
DROP POLICY IF EXISTS "Admins can manage all video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Admins can manage video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Clients can view their own video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Clients can view their permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "video_permissions_manage_admin" ON public.video_permissions;
DROP POLICY IF EXISTS "video_permissions_select_admin" ON public.video_permissions;
DROP POLICY IF EXISTS "video_permissions_select_own" ON public.video_permissions;

-- Recrear políticas seguras para video_permissions
CREATE POLICY "Authenticated admins can manage video permissions"
ON public.video_permissions
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Authenticated clients can view their video permissions"
ON public.video_permissions
FOR SELECT
TO authenticated
USING (client_id = auth.uid());

-- 5. VIDEO_VIEWS - Remover políticas anônimas
DROP POLICY IF EXISTS "Admins can view all video views" ON public.video_views;
DROP POLICY IF EXISTS "Users can update their own video views" ON public.video_views;

-- Recrear políticas seguras para video_views
CREATE POLICY "Authenticated admins can view all video views"
ON public.video_views
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Authenticated users can manage their video views"
ON public.video_views
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. VIDEOS - Remover políticas anônimas
DROP POLICY IF EXISTS "Admins can create videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;
DROP POLICY IF EXISTS "Clients can view assigned videos" ON public.videos;
DROP POLICY IF EXISTS "Clients can view videos with permission" ON public.videos;
DROP POLICY IF EXISTS "videos_manage_admin" ON public.videos;
DROP POLICY IF EXISTS "videos_select_admin" ON public.videos;
DROP POLICY IF EXISTS "videos_select_permitted" ON public.videos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.videos;

-- Recrear políticas seguras para videos
CREATE POLICY "Authenticated admins can manage videos"
ON public.videos
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Authenticated clients can view assigned videos"
ON public.videos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM video_permissions
    WHERE video_permissions.video_id = videos.id
    AND video_permissions.client_id = auth.uid()
  )
);

-- 7. STORAGE OBJECTS - Manter acesso público apenas para client-logos
DROP POLICY IF EXISTS "Admins can delete client logos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update client logos" ON storage.objects;

-- Recrear políticas seguras para storage
CREATE POLICY "Authenticated admins can manage client logos"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'client-logos' AND is_admin())
WITH CHECK (bucket_id = 'client-logos' AND is_admin());

-- Política pública para visualizar logos - MANTIDA por necessidade de negócio
-- CREATE POLICY "Anyone can view client logos"
-- ON storage.objects
-- FOR SELECT
-- USING (bucket_id = 'client-logos');

-- Criar política mais restritiva para storage
CREATE POLICY "Authenticated users can view client logos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'client-logos');