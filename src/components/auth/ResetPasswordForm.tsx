
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validatePasswordStrength } from '@/utils/passwordGenerator';

export const ResetPasswordForm = () => {
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

  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validando link...</p>
        </div>
      </div>
    );
  }

  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/f64ca7e7-2b45-40b3-acdf-ee8120b53523.png" 
                alt="Start Up Soluções Digitais" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              Link Inválido
            </CardTitle>
            <CardDescription>
              Este link de redefinição de senha é inválido ou expirou
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Por favor, solicite um novo link de redefinição de senha.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full mt-4"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/f64ca7e7-2b45-40b3-acdf-ee8120b53523.png" 
                alt="Start Up Soluções Digitais" 
                className="h-16 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Senha Alterada!
            </CardTitle>
            <CardDescription>
              Sua senha foi alterada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Você será redirecionado para a página de login em alguns segundos...
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full mt-4"
            >
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/f64ca7e7-2b45-40b3-acdf-ee8120b53523.png" 
              alt="Start Up Soluções Digitais" 
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Redefinir Senha
          </CardTitle>
          <CardDescription>
            Digite sua nova senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha *</Label>
              <PasswordInput
                id="new-password"
                value={password}
                onChange={setPassword}
                placeholder="Digite sua nova senha"
                showGenerator={true}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Nova Senha *</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirme sua nova senha"
                showGenerator={false}
                showStrengthIndicator={false}
                required
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
              )}
              {password && confirmPassword && password === confirmPassword && password.length >= 8 && (
                <p className="text-sm text-green-600 mt-1">✓ Senhas coincidem</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Alterando senha...' : 'Alterar Senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
