
-- Resolver os warnings de RLS removendo políticas existentes primeiro
-- e criando novas políticas de segurança

-- 1. Limpar e recriar políticas para advertisement_permissions
DROP POLICY IF EXISTS "Only admins can manage advertisement permissions" ON public.advertisement_permissions;
ALTER TABLE public.advertisement_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage advertisement permissions" 
  ON public.advertisement_permissions 
  FOR ALL 
  USING (public.is_admin());

-- 2. Limpar e recriar políticas para advertisements
DROP POLICY IF EXISTS "Admins can manage all advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Clients can view active advertisements" ON public.advertisements;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all advertisements" 
  ON public.advertisements 
  FOR ALL 
  USING (public.is_admin());
CREATE POLICY "Clients can view active advertisements" 
  ON public.advertisements 
  FOR SELECT 
  USING (is_active = true AND NOT public.is_admin());

-- 3. Limpar e recriar políticas para client_users
DROP POLICY IF EXISTS "Only admins can manage client users" ON public.client_users;
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage client users" 
  ON public.client_users 
  FOR ALL 
  USING (public.is_admin());

-- 4. Limpar e recriar políticas para video_permissions
DROP POLICY IF EXISTS "Admins can manage all video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Clients can view their own video permissions" ON public.video_permissions;
ALTER TABLE public.video_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all video permissions" 
  ON public.video_permissions 
  FOR ALL 
  USING (public.is_admin());
CREATE POLICY "Clients can view their own video permissions" 
  ON public.video_permissions 
  FOR SELECT 
  USING (client_id = auth.uid());

-- 5. Limpar e recriar políticas para videos
DROP POLICY IF EXISTS "Admins can manage all videos" ON public.videos;
DROP POLICY IF EXISTS "Clients can view videos with permission" ON public.videos;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage all videos" 
  ON public.videos 
  FOR ALL 
  USING (public.is_admin());
CREATE POLICY "Clients can view videos with permission" 
  ON public.videos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.video_permissions 
      WHERE video_id = videos.id 
      AND client_id = auth.uid()
    )
  );
