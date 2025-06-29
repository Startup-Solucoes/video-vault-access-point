
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, User } from 'lucide-react';
import { ClientUsersManager } from './ClientUsersManager';
import { Badge } from '@/components/ui/badge';

interface ClientUserManagementViewProps {
  client: {
    id: string;
    full_name: string;
    email: string;
    logo_url?: string;
  };
  onBack: () => void;
}

export const ClientUserManagementView = ({ client, onBack }: ClientUserManagementViewProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              
              {client.logo_url && (
                <img
                  src={client.logo_url}
                  alt={`Logo ${client.full_name}`}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gerenciar Acessos
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{client.full_name}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Users className="h-3 w-3 mr-1" />
                    Usuários
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Controle de Acesso ao Dashboard
          </CardTitle>
          <p className="text-sm text-gray-600">
            Gerencie quem pode acessar o dashboard deste cliente. O usuário principal tem acesso total,
            e você pode adicionar usuários adicionais conforme necessário.
          </p>
        </CardHeader>
        <CardContent>
          <ClientUsersManager
            clientId={client.id}
            clientEmail={client.email}
            clientName={client.full_name}
          />
        </CardContent>
      </Card>
    </div>
  );
};
