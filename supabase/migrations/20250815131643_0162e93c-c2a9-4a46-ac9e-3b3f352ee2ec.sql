-- Drop existing broad policy
DROP POLICY IF EXISTS "Authenticated admins can manage client users" ON public.client_users;

-- Create more granular RLS policies
CREATE POLICY "Authenticated admins can view client users" 
ON public.client_users 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Authenticated admins can create client users" 
ON public.client_users 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Authenticated admins can delete client users" 
ON public.client_users 
FOR DELETE 
USING (is_admin());

-- Create security logging function for client_users access
CREATE OR REPLACE FUNCTION public.log_client_users_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log SELECT operations
  IF TG_OP = 'SELECT' THEN
    PERFORM log_security_event(
      'client_users_access',
      jsonb_build_object(
        'operation', 'SELECT',
        'accessed_emails_count', 1,
        'table', 'client_users'
      )
    );
    RETURN NULL;
  END IF;
  
  -- Log INSERT/UPDATE/DELETE operations
  PERFORM log_security_event(
    'client_users_modification',
    jsonb_build_object(
      'operation', TG_OP,
      'client_user_email', CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.user_email
        ELSE NEW.user_email
      END,
      'client_id', CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.client_id
        ELSE NEW.client_id
      END,
      'table', 'client_users'
    )
  );
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for logging client_users access
CREATE TRIGGER log_client_users_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.client_users
  FOR EACH ROW EXECUTE FUNCTION public.log_client_users_access();