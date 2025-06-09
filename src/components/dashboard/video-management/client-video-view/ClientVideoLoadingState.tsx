
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ClientVideoLoadingStateProps {
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientVideoLoadingState = ({ 
  clientName, 
  clientLogoUrl 
}: ClientVideoLoadingStateProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          {clientLogoUrl ? (
            <img 
              src={clientLogoUrl} 
              alt={`Logo ${clientName}`}
              className="h-8 w-8 mr-3 object-contain rounded"
            />
          ) : (
            <User className="h-5 w-5 mr-2" />
          )}
          Vídeos de {clientName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Carregando vídeos...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
