-- CORREÇÃO DE SEGURANÇA: Remover política que expõe dados pessoais publicamente
-- Remove a política perigosa que permite acesso público a todos os perfis
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Verificar se as políticas seguras já existem, se não, criar
-- Política para usuários visualizarem apenas seu próprio perfil
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile only'
    ) THEN
        CREATE POLICY "Users can view their own profile only"
        ON public.profiles
        FOR SELECT
        TO authenticated
        USING (auth.uid() = id);
    END IF;
END $$;

-- Política para admins visualizarem todos os perfis  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can view all profiles safely'
    ) THEN
        CREATE POLICY "Admins can view all profiles safely"
        ON public.profiles
        FOR SELECT
        TO authenticated
        USING (get_current_user_role() = 'admin');
    END IF;
END $$;

-- Limpar outras políticas potencialmente problemáticas
DROP POLICY IF EXISTS "Users can view own profile, admins can view all" ON public.profiles;

-- Garantir que apenas usuários autenticados possam criar perfis
DROP POLICY IF EXISTS "Enable insert during registration" ON public.profiles;
CREATE POLICY "Authenticated users can create their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);