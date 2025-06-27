
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ClientUsersManager } from '@/components/dashboard/client-management/ClientUsersManager';

interface ClientVideoUsersSectionProps {
  clientId: string;
  clientName: string;
  showUsersManager: boolean;
}

export const ClientVideoUsersSection = ({
  clientId,
  clientName,
  showUsersManager
}: ClientVideoUsersSectionProps) => {
  if (!showUsersManager) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5" />
          Gerenciar Usuários do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ClientUsersManager 
          clientId={clientId} 
          clientEmail="placeholder@email.com"
          clientName={clientName}
        />
      </CardContent>
    </Card>
  );
};
