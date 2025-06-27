
import React from 'react';
import { Key, CheckCircle, Info } from 'lucide-react';

export const InfoBanner = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2 text-blue-700">
        <Info className="h-4 w-4" />
        <span className="font-medium text-sm">Informações sobre Usuários</span>
      </div>
      
      <div className="space-y-1 text-sm text-blue-600">
        <p className="flex items-center gap-2">
          <Key className="h-3 w-3" />
          Senhas são geradas automaticamente e exibidas apenas uma vez
        </p>
        <p className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3" />
          Usuários podem acessar diretamente com email e senha
        </p>
      </div>
    </div>
  );
};
