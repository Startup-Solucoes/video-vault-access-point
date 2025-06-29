
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useClientManagement } from '@/hooks/useClientManagement';
import { ClientSearch } from './client-management/ClientSearch';
import { ClientTable } from './client-management/ClientTable';
import { EditClientDialog } from './client-management/EditClientDialog';
import { ClientUserManagementView } from './client-management/ClientUserManagementView';
import { Client } from '@/types/client';

export const ClientManagement = () => {
  const {
    filteredClients,
    searchTerm,
    setSearchTerm,
    isLoading,
    updateClient,
    approveClient,
    deleteClient,
    refreshClients
  } = useClientManagement();

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [managingUserClient, setManagingUserClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleManageUsers = (client: Client) => {
    console.log('🔍 Gerenciando usuários do cliente:', client);
    setManagingUserClient(client);
  };

  const handleBackToList = () => {
    setManagingUserClient(null);
  };

  const handleUpdateClient = (clientId: string, editForm: any) => {
    updateClient(clientId, editForm);
  };

  const handleRefresh = () => {
    console.log('ClientManagement: Botão atualizar clicado');
    refreshClients();
  };

  // Se estamos gerenciando usuários de um cliente, mostrar a view dedicada
  if (managingUserClient) {
    return (
      <ClientUserManagementView
        client={managingUserClient}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciamento de Administradores</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
          <ClientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </CardHeader>
        <CardContent>
          {isLoading && filteredClients.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Carregando administradores...</span>
              </div>
            </div>
          ) : (
            <ClientTable
              clients={filteredClients}
              onEditClient={handleEditClient}
              onManageUsers={handleManageUsers}
              onApproveClient={approveClient}
              onDeleteClient={deleteClient}
            />
          )}
        </CardContent>
      </Card>

      <EditClientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={editingClient}
        onSave={handleUpdateClient}
      />
    </div>
  );
};
