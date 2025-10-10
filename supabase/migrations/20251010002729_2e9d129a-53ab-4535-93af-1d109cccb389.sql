-- Remove política insegura que permite qualquer usuário autenticado inserir logs
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;

-- Criar política restritiva: apenas permitir INSERT via funções SECURITY DEFINER
-- Não criamos uma nova política de INSERT para usuários regulares
-- As funções SECURITY DEFINER (como log_security_event) continuarão funcionando
-- porque elas bypassam as políticas RLS

-- Garantir que a política de SELECT para admins está correta
DROP POLICY IF EXISTS "Admins can view security logs" ON public.security_logs;

CREATE POLICY "Admins can view security logs"
ON public.security_logs
FOR SELECT
TO authenticated
USING (is_admin());

-- Adicionar comentário explicativo na tabela
COMMENT ON TABLE public.security_logs IS 'Security logs table. INSERT operations are restricted to SECURITY DEFINER functions only to prevent log tampering. Regular users cannot insert directly.';