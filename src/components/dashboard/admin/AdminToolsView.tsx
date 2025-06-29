
import React from 'react';
import { ThumbnailGenerator } from '../ThumbnailGenerator';

export const AdminToolsView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ferramentas Administrativas</h2>
        <p className="text-gray-600 mb-8">
          Utilize estas ferramentas para gerenciar e otimizar o sistema de vídeos.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Gerador de Thumbnails (baseado em URL) */}
        <ThumbnailGenerator />
      </div>
    </div>
  );
};
