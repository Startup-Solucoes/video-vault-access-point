
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import { Client } from '@/types/client';

interface ClientStatusBadgeProps {
  client: Client;
}

export const ClientStatusBadge = ({ client }: ClientStatusBadgeProps) => {
  if (client.email_confirmed_at) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Verificado
      </Badge>
    );
  } else {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="h-3 w-3 mr-1" />
        Pendente
      </Badge>
    );
  }
};
