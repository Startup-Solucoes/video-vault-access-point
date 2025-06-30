
import React from 'react';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientInfoProps {
  clientName: string;
}

export const ClientInfo = ({ clientName }: ClientInfoProps) => {
  return (
    <div className="flex items-center gap-2">
      <User className="h-5 w-5 text-blue-600" />
      <div>
        <span className="font-semibold text-gray-900">{clientName}</span>
        <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
          Administrador Principal
        </Badge>
      </div>
    </div>
  );
};
