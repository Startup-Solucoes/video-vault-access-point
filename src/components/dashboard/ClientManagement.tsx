
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClientManagement } from '@/hooks/useClientManagement';
import { ClientSearch } from './client-management/ClientSearch';
import { ClientTable } from './client-management/ClientTable';
import { EditClientDialog } from './client-management/EditClientDialog';
import { Client } from '@/types/client';

export const ClientManagement = () => {
  const {
    filteredClients,
    searchTerm,
    setSearchTerm,
    isLoading,
    activeTab,
    setActiveTab,
    updateClient,
    approveClient,
    deleteClient,
    getTabCounts
  } = useClientManagement();

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = (clientId: string, editForm: any) => {
    updateClient(clientId, editForm);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'admins' | 'clients' | 'verified' | 'unverified' | 'deleted');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const counts = getTabCounts();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <ClientSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">
                Todos ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="admins">
                Admins ({counts.admins})
              </TabsTrigger>
              <TabsTrigger value="clients">
                Clientes ({counts.clients})
              </TabsTrigger>
              <TabsTrigger value="verified">
                Verificados ({counts.verified})
              </TabsTrigger>
              <TabsTrigger value="unverified">
                Pendentes ({counts.unverified})
              </TabsTrigger>
              <TabsTrigger value="deleted">
                Excluídos ({counts.deleted})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <ClientTable
                clients={filteredClients}
                onEditClient={handleEditClient}
                onApproveClient={approveClient}
                onDeleteClient={deleteClient}
              />
            </TabsContent>
          </Tabs>
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
