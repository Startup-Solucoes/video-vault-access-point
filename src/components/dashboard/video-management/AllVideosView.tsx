
import React from 'react';
import { Card } from '@/components/ui/card';
import { ClientSelectionModal } from '@/components/forms/client-selector/ClientSelectionModal';
import { useAllVideosState } from '@/hooks/useAllVideosState';
import { AllVideosHeader } from './all-videos-view/AllVideosHeader';
import { AllVideosContent } from './all-videos-view/AllVideosContent';
import { AllVideosLoading } from './all-videos-view/AllVideosLoading';

export const AllVideosView = () => {
  const {
    // Data
    currentPageVideos,
    totalItems,
    totalPages,
    clients,
    filteredClients,
    
    // Loading states
    isLoading,
    clientsLoading,
    isAssigning,
    
    // Selection states
    selectedVideos,
    selectedClients,
    
    // UI states
    showClientSelector,
    currentPage,
    itemsPerPage,
    searchValue,
    
    // Handlers
    handleVideoSelect,
    handleSelectAllVisible,
    handleClientToggle,
    handleBulkClientChange,
    handleItemsPerPageChange,
    handlePageChange,
    handleModalClose,
    handleConfirmSelection,
    setSearchValue
  } = useAllVideosState();

  if (isLoading) {
    return <AllVideosLoading />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <AllVideosHeader
          totalVideos={totalItems}
          currentVideos={currentPageVideos}
          selectedVideos={selectedVideos}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onSelectAllVisible={handleSelectAllVisible}
          onAssignToClients={() => setShowClientSelector(true)}
        />
        
        <AllVideosContent
          currentPageVideos={currentPageVideos}
          selectedVideos={selectedVideos}
          onVideoSelect={handleVideoSelect}
          currentPage={currentPage}
          totalPages={totalPages}
          totalVideos={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </Card>

      <ClientSelectionModal
        open={showClientSelector}
        onOpenChange={handleModalClose}
        clients={clients}
        selectedClients={selectedClients}
        onClientToggle={handleClientToggle}
        onBulkClientChange={handleBulkClientChange}
        isLoading={clientsLoading}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        filteredClients={filteredClients}
        onConfirmSelection={handleConfirmSelection}
        isAssigning={isAssigning}
      />
    </div>
  );
};
