-- Create function to prevent role changes by non-admins
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if role is being changed
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Only allow if user is an admin
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Não autorizado a alterar role. Apenas administradores podem modificar roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to protect role field
CREATE TRIGGER protect_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_change();