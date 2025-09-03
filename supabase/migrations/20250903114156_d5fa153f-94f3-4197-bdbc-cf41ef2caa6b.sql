-- Atualizar a função trigger para considerar 20 segundos como visualização válida
CREATE OR REPLACE FUNCTION public.update_video_view_count()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  -- Atualizar contador apenas para visualizações válidas (>= 20 segundos)
  IF NEW.is_valid_view = true AND NEW.watch_duration >= 20 AND (OLD.is_valid_view IS NULL OR OLD.is_valid_view = false OR OLD.watch_duration < 20) THEN
    UPDATE public.videos 
    SET view_count = view_count + 1
    WHERE id = NEW.video_id;
  END IF;
  
  RETURN NEW;
END;
$function$;