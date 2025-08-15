
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validatePasswordStrength } from '@/utils/passwordGenerator';
import { safeRedirect } from '@/utils/urlUtils';

export const useResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkTokenAndSetSession = async () => {
      try {
        console.log('=== RESET PASSWORD DEBUG ===');
        console.log('Current URL:', window.location.href);
        console.log('Pathname:', window.location.pathname);
        console.log('Hash:', window.location.hash);
        console.log('Search:', window.location.search);
        
        // Primeiro verificar se já temos uma sessão ativa
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session ? 'Active session found' : 'No session');
        
        if (session) {
          console.log('✅ Already authenticated, session is valid');
          setIsValidToken(true);
          return;
        }
        
        // Se não temos sessão, tentar extrair tokens da URL
        const urlParams = new URLSearchParams(window.location.search);
        const fragment = new URLSearchParams(window.location.hash.substring(1));
        
        // Verificar tanto query params quanto hash params
        const accessToken = urlParams.get('access_token') || fragment.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || fragment.get('refresh_token');
        const type = urlParams.get('type') || fragment.get('type');

        console.log('Extracted tokens:', { 
          accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : null, 
          refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : null, 
          type,
          hasHash: !!window.location.hash,
          hasSearch: !!window.location.search
        });

        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Valid recovery tokens found! Setting session...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ Error setting session:', error);
            setIsValidToken(false);
            toast({
              title: "Erro",
              description: "Link de reset inválido ou expirado",
              variant: "destructive"
            });
          } else {
            console.log('✅ Session set successfully:', data.session ? 'Session created' : 'No session');
            setIsValidToken(true);
            
            // Limpar a URL dos parâmetros sensíveis
            console.log('Cleaning URL...');
            window.history.replaceState({}, document.title, '/reset-password');
          }
        } else {
          console.log('❌ Invalid or missing recovery tokens');
          console.log('Missing:', {
            type: !type || type !== 'recovery',
            accessToken: !accessToken,
            refreshToken: !refreshToken
          });
          
          // Se não encontrou tokens válidos e não tem sessão, é link inválido
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('❌ Error in checkTokenAndSetSession:', error);
        setIsValidToken(false);
      }
    };

    // Pequeno delay para garantir que a página carregou completamente
    const timer = setTimeout(checkTokenAndSetSession, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== PASSWORD RESET ATTEMPT ===');

    if (!password || !confirmPassword) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isStrong) {
      toast({
        title: "Senha fraca",
        description: "A senha deve atender aos critérios de segurança",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Updating user password...');
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('❌ Password update error:', error);
        throw error;
      }

      console.log('✅ Password updated successfully');
      setIsSuccess(true);
      
      toast({
        title: "Sucesso!",
        description: "Sua senha foi alterada com sucesso",
      });

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        safeRedirect('/');
      }, 3000);

    } catch (error: any) {
      console.error('❌ Erro ao redefinir senha:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao redefinir senha",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    isValidToken,
    isSuccess,
    handleResetPassword
  };
};
