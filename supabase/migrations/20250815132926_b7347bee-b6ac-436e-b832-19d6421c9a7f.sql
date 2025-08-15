-- Correção Definitiva de Segurança: Eliminação de Acesso Anônimo
-- Remove políticas problemáticas e recria com restrições adequadas

-- 1. TABELA CLIENT_USERS - Corrigir 3 políticas críticas
DROP POLICY IF EXISTS "Authenticated admins can view client users" ON public.client_users;
DROP POLICY IF EXISTS "Authenticated admins can create client users" ON public.client_users;
DROP POLICY IF EXISTS "Authenticated admins can delete client users" ON public.client_users;

-- Recriar políticas apenas para usuários autenticados
CREATE POLICY "Authenticated admins can view client users" 
ON public.client_users 
FOR SELECT 
TO authenticated 
USING (is_admin());

CREATE POLICY "Authenticated admins can create client users" 
ON public.client_users 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin());

CREATE POLICY "Authenticated admins can delete client users" 
ON public.client_users 
FOR DELETE 
TO authenticated 
USING (is_admin());

-- 2. TABELA PROFILES - Corrigir política de criação
DROP POLICY IF EXISTS "Users can create profiles" ON public.profiles;

CREATE POLICY "Users can create profiles" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 3. TABELA SECURITY_LOGS - Corrigir políticas
DROP POLICY IF EXISTS "Admins can view security logs" ON public.security_logs;
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;

-- Apenas admins autenticados podem ver logs
CREATE POLICY "Admins can view security logs" 
ON public.security_logs 
FOR SELECT 
TO authenticated 
USING (is_admin());

-- Sistema pode inserir logs (para funções internas)
CREATE POLICY "System can insert security logs" 
ON public.security_logs 
FOR INSERT 
TO service_role 
WITH CHECK (true);

-- 4. TABELA VIDEO_VIEWS - Corrigir política de criação
DROP POLICY IF EXISTS "Users can create their own video views" ON public.video_views;

CREATE POLICY "Users can create their own video views" 
ON public.video_views 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 5. CORRIGIR OUTRAS POLÍTICAS PROBLEMÁTICAS IDENTIFICADAS
-- TABELA ADVERTISEMENT_PERMISSIONS
DROP POLICY IF EXISTS "Authenticated clients can view their advertisement permissions" ON public.advertisement_permissions;
DROP POLICY IF EXISTS "Authenticated admins can manage advertisement permissions" ON public.advertisement_permissions;

CREATE POLICY "Authenticated clients can view their advertisement permissions" 
ON public.advertisement_permissions 
FOR SELECT 
TO authenticated 
USING (client_id = auth.uid());

CREATE POLICY "Authenticated admins can manage advertisement permissions" 
ON public.advertisement_permissions 
FOR ALL 
TO authenticated 
USING (is_admin()) 
WITH CHECK (is_admin());

-- TABELA ADVERTISEMENTS
DROP POLICY IF EXISTS "Authenticated admins can manage advertisements" ON public.advertisements;
DROP POLICY IF EXISTS "Authenticated clients can view active advertisements" ON public.advertisements;

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
USING ((is_active = true) AND (NOT is_admin()));

-- TABELA VIDEO_PERMISSIONS
DROP POLICY IF EXISTS "Authenticated admins can manage video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Authenticated clients can view their video permissions" ON public.video_permissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.video_permissions;

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

CREATE POLICY "Enable insert for authenticated users only" 
ON public.video_permissions 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- TABELA VIDEOS
DROP POLICY IF EXISTS "Authenticated admins can manage videos" ON public.videos;
DROP POLICY IF EXISTS "Authenticated clients can view assigned videos" ON public.videos;

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
USING (EXISTS ( 
  SELECT 1 FROM video_permissions 
  WHERE video_permissions.video_id = videos.id 
  AND video_permissions.client_id = auth.uid()
));

-- TABELA VIDEO_VIEWS - Corrigir outras políticas
DROP POLICY IF EXISTS "Authenticated admins can view all video views" ON public.video_views;
DROP POLICY IF EXISTS "Authenticated users can manage their video views" ON public.video_views;

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