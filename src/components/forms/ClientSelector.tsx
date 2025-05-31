
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { useClientSelector } from '@/hooks/useClientSelector';
import { ClientBadgeList } from './client-selector/ClientBadgeList';
import { ClientSelectionModal } from './client-selector/ClientSelectionModal';
import { ClientSelectorProps, ClientSelectorRef } from './client-selector/ClientSelectorTypes';

export const ClientSelector = forwardRef<ClientSelectorRef, ClientSelectorProps>(
  ({ selectedClients, onClientChange }, ref) => {
    const [modalOpen, setModalOpen] = useState(false);
    const {
      clients,
      filteredClients,
      isLoading,
      searchValue,
      setSearchValue,
      fetchClients
    } = useClientSelector();

    // Expor função para refresh via ref
    useImperativeHandle(ref, () => ({
      refreshClients: fetchClients
    }));

    const handleClientToggle = (clientId: string) => {
      console.log('Cliente toggleado:', clientId);
      const newSelection = selectedClients.includes(clientId)
        ? selectedClients.filter(id => id !== clientId)
        : [...selectedClients, clientId];
      
      console.log('Nova seleção de clientes:', newSelection);
      onClientChange(newSelection);
    };

    const removeClient = (clientId: string) => {
      console.log('Removendo cliente:', clientId);
      onClientChange(selectedClients.filter(id => id !== clientId));
    };

    const getSelectedClientsText = () => {
      if (selectedClients.length === 0) {
        return "Nenhum cliente selecionado";
      }
      if (selectedClients.length === 1) {
        const client = clients.find(c => c.id === selectedClients[0]);
        return client?.full_name || "1 cliente selecionado";
      }
      return `${selectedClients.length} clientes selecionados`;
    };

    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setModalOpen(true)}
          className="w-full justify-start"
        >
          Selecionar Clientes ({getSelectedClientsText()})
        </Button>

        <ClientBadgeList
          selectedClients={selectedClients}
          clients={clients}
          onRemoveClient={removeClient}
        />

        <ClientSelectionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          clients={clients}
          selectedClients={selectedClients}
          onClientToggle={handleClientToggle}
          isLoading={isLoading}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          filteredClients={filteredClients}
        />
      </div>
    );
  }
);

ClientSelector.displayName = 'ClientSelector';

export type { ClientSelectorRef };
