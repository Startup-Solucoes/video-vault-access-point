

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './LoginForm';
interface AuthFormProps {
  onSuccess: () => void;
}
export const AuthForm = ({
  onSuccess
}: AuthFormProps) => {
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-md bg-white border-gray-200">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/f64ca7e7-2b45-40b3-acdf-ee8120b53523.png" alt="Start Up Soluções Digitais" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tutoriais e videos</CardTitle>
          <CardDescription className="text-gray-600">
            Faça login para acessar o conteúdo exclusivo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={onSuccess} />
        </CardContent>
      </Card>
    </div>;
};

