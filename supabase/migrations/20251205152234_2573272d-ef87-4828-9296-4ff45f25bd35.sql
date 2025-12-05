-- Criar função RPC para contar vídeos por cliente
CREATE OR REPLACE FUNCTION public.get_video_counts_by_client()
RETURNS TABLE(client_id uuid, video_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    vp.client_id,
    COUNT(vp.video_id) as video_count
  FROM video_permissions vp
  GROUP BY vp.client_id;
$$;