
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ClientUsersManager } from '@/components/dashboard/client-management/ClientUsersManager';

interface ClientVideoUsersSectionProps {
  clientId: string;
  clientName: string;
  clientEmail?: string; // Tornar opcional mas preferível
  showUsersManager: boolean;
}

export const ClientVideoUsersSection = ({
  clientId,
  clientName,
  clientEmail,
  showUsersManager
}: ClientVideoUsersSectionProps) => {
  if (!showUsersManager) return null;

  // Se não temos email específico do cliente, buscar dos dados do cliente
  const fallbackEmail = clientEmail || 'email@temporario.com';

  console.log('🎯 ClientVideoUsersSection - Dados passados:', {
    clientId,
    clientName,
    clientEmail,
    fallbackEmail
  });

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
          clientEmail={fallbackEmail}
          clientName={clientName}
        />
      </CardContent>
    </Card>
  );
};
