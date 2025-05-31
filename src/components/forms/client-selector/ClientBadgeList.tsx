
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Client } from './ClientSelectorTypes';

interface ClientBadgeListProps {
  selectedClients: string[];
  clients: Client[];
  onRemoveClient: (clientId: string) => void;
}

export const ClientBadgeList: React.FC<ClientBadgeListProps> = ({
  selectedClients,
  clients,
  onRemoveClient
}) => {
  if (selectedClients.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {selectedClients.map((clientId) => {
        const client = clients.find(c => c.id === clientId);
        return (
          <Badge key={clientId} variant="secondary" className="flex items-center gap-1">
            {client?.full_name || 'Cliente'}
            <button
              type="button"
              onClick={() => onRemoveClient(clientId)}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </Badge>
        );
      })}
    </div>
  );
};
