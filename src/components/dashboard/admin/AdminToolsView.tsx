
import React from 'react';
import { AdvertisementManagement } from '../advertisement-management/AdvertisementManagement';

export const AdminToolsView = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ferramentas Administrativas</h2>
        <p className="text-gray-600 mb-8">
          Gerencie anúncios e outras funcionalidades administrativas do sistema.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Gerenciamento de Anúncios */}
        <AdvertisementManagement />
      </div>
    </div>
  );
};
