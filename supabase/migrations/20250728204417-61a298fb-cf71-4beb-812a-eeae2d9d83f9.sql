-- Adicionar coluna publish_date à tabela videos
ALTER TABLE public.videos 
ADD COLUMN publish_date TIMESTAMP WITH TIME ZONE;

-- Definir publish_date como created_at para vídeos existentes
UPDATE public.videos 
SET publish_date = created_at 
WHERE publish_date IS NULL;