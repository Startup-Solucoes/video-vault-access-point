
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export const SuccessState = () => {
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
};
