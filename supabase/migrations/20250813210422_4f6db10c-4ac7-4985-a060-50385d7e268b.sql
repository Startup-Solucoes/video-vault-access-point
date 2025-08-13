-- CORREÇÃO CRÍTICA: Restaurar acesso público às logos dos clientes
-- Sem isso, as logos não aparecerão na interface
CREATE POLICY "Public client logos access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'client-logos');

-- Política para permitir uploads de logos por usuários autenticados
CREATE POLICY "Authenticated users can upload client logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'client-logos' 
  AND auth.uid() IS NOT NULL
);

-- Política para permitir atualizações de logos por usuários autenticados
CREATE POLICY "Authenticated users can update client logos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'client-logos' 
  AND auth.uid() IS NOT NULL
);

-- Adicionar trigger para logging de ações de segurança
CREATE TABLE IF NOT EXISTS public.security_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de segurança
CREATE POLICY "Admins can view security logs"
ON public.security_logs
FOR SELECT
USING (is_admin());

-- Sistema pode inserir logs (para edge functions)
CREATE POLICY "System can insert security logs"
ON public.security_logs
FOR INSERT
WITH CHECK (true);

-- Função para registrar eventos de segurança
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action text,
  p_details jsonb DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_logs (user_id, action, details, ip_address, user_agent)
  VALUES (auth.uid(), p_action, p_details, p_ip_address, p_user_agent);
END;
$$;