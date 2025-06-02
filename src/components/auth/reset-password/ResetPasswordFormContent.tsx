
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';

interface ResetPasswordFormContentProps {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ResetPasswordFormContent = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit
}: ResetPasswordFormContentProps) => {
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
          <form onSubmit={onSubmit} className="space-y-4">
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
