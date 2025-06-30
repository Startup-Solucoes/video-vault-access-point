
import React from 'react';
import { ClientUsersManager } from '@/components/dashboard/client-management/ClientUsersManager';

interface ClientUserManagementViewProps {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientLogoUrl?: string;
  onBack: () => void;
}

export const ClientUserManagementView = ({
  clientId,
  clientName,
  clientEmail,
  clientLogoUrl,
  onBack
}: ClientUserManagementViewProps) => {
  return (
    <div className="space-y-6">
      {/* Conteúdo principal - apenas o gerenciador sem cabeçalho adicional */}
      <ClientUsersManager 
        clientId={clientId} 
        clientEmail={clientEmail}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
      />
    </div>
  );
};
