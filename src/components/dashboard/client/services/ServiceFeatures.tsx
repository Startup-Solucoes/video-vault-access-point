
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Shield, Clock, Headphones } from 'lucide-react';

export const ServiceFeatures = () => {
  return (
    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Zap className="h-5 w-5" />
          Por que escolher nossos serviços?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Shield className="h-8 w-8 text-gray-700" />
            <div>
              <h4 className="font-medium text-gray-900">Segurança</h4>
              <p className="text-sm text-gray-700">Serviços confiáveis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Clock className="h-8 w-8 text-gray-700" />
            <div>
              <h4 className="font-medium text-gray-900">Agilidade</h4>
              <p className="text-sm text-gray-700">Entrega rápida</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Headphones className="h-8 w-8 text-gray-700" />
            <div>
              <h4 className="font-medium text-gray-900">Suporte</h4>
              <p className="text-sm text-gray-700">Atendimento especializado</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
