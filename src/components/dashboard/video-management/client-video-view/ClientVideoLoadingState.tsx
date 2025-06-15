
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
    <Card className="w-full mx-auto max-w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-sm md:text-base">
          {clientLogoUrl ? (
            <img 
              src={clientLogoUrl} 
              alt={`Logo ${clientName}`}
              className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 object-contain rounded flex-shrink-0"
            />
          ) : (
            <User className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
          )}
          <span className="truncate">Vídeos de {clientName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8 md:py-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
            <p className="text-xs md:text-sm text-gray-500">Carregando vídeos...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
