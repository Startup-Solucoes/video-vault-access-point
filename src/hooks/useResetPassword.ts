
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validatePasswordStrength } from '@/utils/passwordGenerator';

export const useResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkTokenAndSetSession = async () => {
      try {
        // Verificar se há parâmetros na URL para reset de senha
        const urlParams = new URLSearchParams(window.location.search);
        const fragment = new URLSearchParams(window.location.hash.substring(1));
        
        // Verificar tanto query params quanto hash params
        const accessToken = urlParams.get('access_token') || fragment.get('access_token');
        const refreshToken = urlParams.get('refresh_token') || fragment.get('refresh_token');
        const type = urlParams.get('type') || fragment.get('type');

        console.log('Reset password params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Setting session with recovery tokens...');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Erro ao validar token:', error);
            setIsValidToken(false);
          } else {
            console.log('Session set successfully:', data);
            setIsValidToken(true);
            
            // Limpar a URL dos parâmetros sensíveis
            window.history.replaceState({}, document.title, '/reset-password');
          }
        } else {
          console.log('No valid recovery tokens found');
          setIsValidToken(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsValidToken(false);
      }
    };

    checkTokenAndSetSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

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
        console.error('Password update error:', error);
        throw error;
      }

      console.log('Password updated successfully');
      setIsSuccess(true);
      
      toast({
        title: "Sucesso!",
        description: "Sua senha foi alterada com sucesso",
      });

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
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
