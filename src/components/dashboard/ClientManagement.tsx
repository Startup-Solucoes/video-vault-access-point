
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
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
    getTabCounts,
    refreshClients
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
    setActiveTab(value as 'all' | 'admins' | 'clients' | 'unverified' | 'deleted');
  };

  const handleRefresh = () => {
    console.log('ClientManagement: Botão atualizar clicado');
    refreshClients();
  };

  const counts = getTabCounts();

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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Todos ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="admins">
                Admins ({counts.admins})
              </TabsTrigger>
              <TabsTrigger value="clients">
                Admins ({counts.clients})
              </TabsTrigger>
              <TabsTrigger value="unverified">
                Pendentes ({counts.unverified})
              </TabsTrigger>
              <TabsTrigger value="deleted">
                Excluídos ({counts.deleted})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
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
