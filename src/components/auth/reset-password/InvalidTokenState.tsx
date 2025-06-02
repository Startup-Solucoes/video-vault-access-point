
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export const InvalidTokenState = () => {
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
};
