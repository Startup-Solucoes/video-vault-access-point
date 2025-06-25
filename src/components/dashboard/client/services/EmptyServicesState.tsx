
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export const EmptyServicesState = () => {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gray-200 rounded-full">
            <Star className="h-12 w-12 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Nenhum serviço disponível no momento
          </h3>
          <p className="text-gray-600 max-w-md">
            Novos serviços serão adicionados em breve. Fique atento às atualizações!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
