
import React from 'react';
import { ClientSelectionModal } from '@/components/forms/client-selector/ClientSelectionModal';
import { EditVideoForm } from '@/components/forms/EditVideoForm';

interface ClientVideoModalsProps {
  // Client selector state
  showClientSelector: boolean;
  clients: any[];
  filteredClients: any[];
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
  return (
    <>
      {/* Client Selection Modal */}
      <ClientSelectionModal
        open={showClientSelector}
        onOpenChange={onModalClose}
        clients={clients}
        selectedClients={selectedClients}
        onClientToggle={onClientToggle}
        onBulkClientChange={onBulkClientChange}
        isLoading={clientsLoading}
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        filteredClients={filteredClients}
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
