
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
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
      {/* Cabeçalho com botão voltar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Vídeos
          </Button>

          <div className="flex items-center gap-3">
            {clientLogoUrl && (
              <img
                src={clientLogoUrl}
                alt={`Logo ${clientName}`}
                className="w-8 h-8 rounded-lg object-cover border border-gray-200"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Gerenciamento de Usuários - {clientName}
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie os usuários que têm acesso ao dashboard deste cliente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários com Acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ClientUsersManager 
            clientId={clientId} 
            clientEmail={clientEmail}
            clientName={clientName}
            clientLogoUrl={clientLogoUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
};
