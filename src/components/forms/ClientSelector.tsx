
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useClientSelector } from '@/hooks/useClientSelector';
import { ClientSearchPopover } from './client-selector/ClientSearchPopover';
import { ClientBadgeList } from './client-selector/ClientBadgeList';
import { ClientSelectorProps, ClientSelectorRef } from './client-selector/ClientSelectorTypes';

export const ClientSelector = forwardRef<ClientSelectorRef, ClientSelectorProps>(
  ({ selectedClients, onClientChange }, ref) => {
    const [open, setOpen] = useState(false);
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

    const handleClientSelect = (clientId: string) => {
      console.log('Cliente selecionado:', clientId);
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

    return (
      <div className="space-y-2">
        <ClientSearchPopover
          open={open}
          onOpenChange={setOpen}
          selectedClients={selectedClients}
          filteredClients={filteredClients}
          clients={clients}
          isLoading={isLoading}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          onClientSelect={handleClientSelect}
        />

        <ClientBadgeList
          selectedClients={selectedClients}
          clients={clients}
          onRemoveClient={removeClient}
        />
      </div>
    );
  }
);

ClientSelector.displayName = 'ClientSelector';

export type { ClientSelectorRef };
