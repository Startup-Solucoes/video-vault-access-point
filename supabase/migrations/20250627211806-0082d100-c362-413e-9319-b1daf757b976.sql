
-- Corrigir o search_path das funções para maior segurança
-- Isso previne ataques de privilege escalation através de search_path manipulation

-- Atualizar a função check_user_exists
CREATE OR REPLACE FUNCTION public.check_user_exists(user_email text)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = public, auth
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = user_email
  );
$function$;

-- Atualizar a função is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$function$;

-- Atualizar a função get_current_user_role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$function$;

-- Atualizar a função delete_user_completely
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_email text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, auth
AS $function$
DECLARE
  user_id uuid;
  result json;
BEGIN
  -- Buscar o ID do usuário pelo email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN json_build_object(
      'success', false, 
      'message', 'Usuário não encontrado'
    );
  END IF;
  
  -- Deletar do profiles (se existir)
  DELETE FROM public.profiles WHERE id = user_id;
  
  -- Deletar do auth.users
  DELETE FROM auth.users WHERE id = user_id;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Usuário deletado completamente',
    'user_id', user_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false, 
      'message', 'Erro ao deletar usuário: ' || SQLERRM
    );
END;
$function$;

-- Atualizar a função update_video_view_count
CREATE OR REPLACE FUNCTION public.update_video_view_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- Atualizar contador apenas para visualizações válidas (>= 60 segundos)
  IF NEW.is_valid_view = true AND (OLD.is_valid_view IS NULL OR OLD.is_valid_view = false) THEN
    UPDATE public.videos 
    SET view_count = view_count + 1
    WHERE id = NEW.video_id;
  END IF;
  
  RETURN NEW;
END;
$function$;
