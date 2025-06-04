
import React from 'react';
import { Video } from 'lucide-react';

export const ClientVideoEmptyState = () => {
  return (
    <div className="text-center py-12">
      <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum vídeo disponível para este cliente
      </h3>
      <p className="text-gray-500">
        Adicione permissões de vídeos para este cliente
      </p>
    </div>
  );
};
