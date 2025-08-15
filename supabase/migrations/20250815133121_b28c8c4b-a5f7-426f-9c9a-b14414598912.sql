-- Corrigir search_path para todas as funções restantes sem SET search_path
ALTER FUNCTION public.check_user_exists(text) SET search_path = 'public', 'auth';
ALTER FUNCTION public.delete_user_completely(text) SET search_path = 'public', 'auth';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.log_client_users_access() SET search_path = 'public';
ALTER FUNCTION public.log_security_event(text, jsonb, text, text) SET search_path = 'public';
ALTER FUNCTION public.update_video_view_count() SET search_path = 'public';