
-- Primeiro, vamos remover a política problemática se ela existir
DROP POLICY IF EXISTS "Admins can delete all profiles" ON public.profiles;

-- Criar uma função segura para verificar se o usuário é admin
-- Esta função usa SECURITY DEFINER para evitar recursão infinita em RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Criar políticas RLS seguras para a tabela profiles
-- Política para SELECT: usuários podem ver seu próprio perfil, admins podem ver todos
CREATE POLICY "Users can view own profile, admins can view all" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = id OR public.is_admin()
  );

-- Política para INSERT: apenas durante o registro (handled by trigger)
CREATE POLICY "Enable insert during registration" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Política para UPDATE: usuários podem atualizar seu próprio perfil, admins podem atualizar todos
CREATE POLICY "Users can update own profile, admins can update all" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    auth.uid() = id OR public.is_admin()
  );

-- Política para DELETE: apenas admins podem deletar perfis
CREATE POLICY "Only admins can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  USING (public.is_admin());

-- Habilitar RLS na tabela profiles se ainda não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
