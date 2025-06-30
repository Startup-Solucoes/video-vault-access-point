
import React from 'react';
import { ClientSelectionModal } from '@/components/forms/client-selector/ClientSelectionModal';
import { EditVideoForm } from '@/components/forms/EditVideoForm';
import { Client } from '@/types/client';

interface ClientVideoModalsProps {
  // Client selector state
  showClientSelector: boolean;
  clients: Client[];
  filteredClients: Client[];
  clientsLoading: boolean;
  searchValue: string;
  selectedClients: string[];
  isAssigning: boolean;
  
  // Edit video state
  editingVideoId: string | null;
  isEditModalOpen: boolean;
  
  // Handlers
  onModalClose: (open: boolean) => void;
  onConfirmSelection: () => void;
  onCloseEditModal: () => void;
  onSearchValueChange: (value: string) => void;
  onClientToggle: (clientId: string) => void;
  onBulkClientChange: (clientIds: string[]) => void;
}

export const ClientVideoModals = ({
  showClientSelector,
  clients,
  filteredClients,
  clientsLoading,
  searchValue,
  selectedClients,
  isAssigning,
  editingVideoId,
  isEditModalOpen,
  onModalClose,
  onConfirmSelection,
  onCloseEditModal,
  onSearchValueChange,
  onClientToggle,
  onBulkClientChange
}: ClientVideoModalsProps) => {
  // Converter Client[] para o formato esperado pelo ClientSelectionModal
  const convertedClients = clients.map(client => ({
    id: client.id,
    full_name: client.full_name,
    email: client.email
  }));

  const convertedFilteredClients = filteredClients.map(client => ({
    id: client.id,
    full_name: client.full_name,
    email: client.email
  }));

  return (
    <>
      {/* Client Selection Modal */}
      <ClientSelectionModal
        open={showClientSelector}
        onOpenChange={onModalClose}
        clients={convertedClients}
        selectedClients={selectedClients}
        onClientToggle={onClientToggle}
        onBulkClientChange={onBulkClientChange}
        isLoading={clientsLoading}
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        filteredClients={convertedFilteredClients}
        onConfirmSelection={onConfirmSelection}
        isAssigning={isAssigning}
      />

      {/* Edit Video Modal */}
      {editingVideoId && (
        <EditVideoForm
          open={isEditModalOpen}
          onOpenChange={onCloseEditModal}
          videoId={editingVideoId}
        />
      )}
    </>
  );
};
