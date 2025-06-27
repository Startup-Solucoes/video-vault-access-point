
import React from 'react';
import { Key, CheckCircle } from 'lucide-react';

export const InfoBanner = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="space-y-2">
        <p className="text-xs text-blue-800 flex items-center gap-2">
          <Key className="h-4 w-4" />
          <strong>Gerenciamento de senhas:</strong> As senhas são armazenadas com segurança e podem ser visualizadas ou copiadas usando os botões ao lado de cada senha.
        </p>
        <p className="text-xs text-green-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <strong>Email de confirmação desabilitado:</strong> Os usuários podem fazer login diretamente sem confirmar o email.
        </p>
      </div>
    </div>
  );
};
