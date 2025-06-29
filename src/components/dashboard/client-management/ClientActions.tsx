
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { Client } from '@/types/client';

interface ClientActionsProps {
  client: Client;
  onEdit: (client: Client) => void;
  onApprove: (clientId: string, clientEmail: string) => void;
  onDelete: (clientId: string, clientName: string) => void;
}

export const ClientActions = ({ client, onEdit, onDelete }: ClientActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(client)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDelete(client.id, client.full_name)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
