
-- Criar tabela para rastrear visualizações de vídeos
CREATE TABLE public.video_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  watch_duration INTEGER NOT NULL DEFAULT 0, -- duração em segundos
  is_valid_view BOOLEAN NOT NULL DEFAULT false, -- true se assistiu pelo menos 60 segundos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Índices para melhor performance
  UNIQUE(video_id, user_id, viewed_at)
);

-- Adicionar RLS para garantir que usuários só vejam suas próprias visualizações
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

-- Política para que usuários possam criar suas próprias visualizações
CREATE POLICY "Users can create their own video views" 
  ON public.video_views 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política para que usuários possam atualizar suas próprias visualizações
CREATE POLICY "Users can update their own video views" 
  ON public.video_views 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para que administradores possam ver todas as visualizações
CREATE POLICY "Admins can view all video views" 
  ON public.video_views 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Adicionar coluna de contagem de visualizações na tabela videos para facilitar consultas
ALTER TABLE public.videos 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Função para atualizar contador de visualizações
CREATE OR REPLACE FUNCTION update_video_view_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contador apenas para visualizações válidas (>= 60 segundos)
  IF NEW.is_valid_view = true AND (OLD.is_valid_view IS NULL OR OLD.is_valid_view = false) THEN
    UPDATE public.videos 
    SET view_count = view_count + 1
    WHERE id = NEW.video_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador automaticamente
CREATE TRIGGER trigger_update_video_view_count
  AFTER INSERT OR UPDATE ON public.video_views
  FOR EACH ROW
  EXECUTE FUNCTION update_video_view_count();

-- Índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_video_views_video_id ON public.video_views(video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_user_id ON public.video_views(user_id);
CREATE INDEX IF NOT EXISTS idx_video_views_valid ON public.video_views(is_valid_view) WHERE is_valid_view = true;
