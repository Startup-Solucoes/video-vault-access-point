
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './LoginForm';

interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Portal de Vídeos
          </CardTitle>
          <CardDescription>
            Faça login para acessar o conteúdo exclusivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={onSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};
