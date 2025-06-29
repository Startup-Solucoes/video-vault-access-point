
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import { useClientManagement } from '@/hooks/useClientManagement';
import { ClientSearch } from './client-management/ClientSearch';
import { ClientTable } from './client-management/ClientTable';
import { EditClientDialog } from './client-management/EditClientDialog';
import { ClientForm } from '@/components/forms/ClientForm';
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = (clientId: string, editForm: any) => {
    updateClient(clientId, editForm);
  };

  const handleRefresh = () => {
    console.log('ClientManagement: Botão atualizar clicado');
    refreshClients();
  };

  const handleClientCreated = () => {
    console.log('ClientManagement: Cliente criado com sucesso');
    setIsClientFormOpen(false);
    refreshClients();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gerenciamento de Administradores</CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsClientFormOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Cadastrar Administrador
              </Button>
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

      <ClientForm 
        open={isClientFormOpen} 
        onOpenChange={setIsClientFormOpen} 
        onClientCreated={handleClientCreated} 
      />
    </div>
  );
};
