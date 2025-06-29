
import React from 'react';
import { useClientVideoContainer } from './hooks/useClientVideoContainer';
import { useClientVideoCallbacks } from './hooks/useClientVideoCallbacks';
import { ClientVideoLoadingState } from './ClientVideoLoadingState';
import { ClientVideoReorderMode } from './ClientVideoReorderMode';
import { ClientVideoMainView } from './ClientVideoMainView';
import { VideoForm } from '@/components/forms/VideoForm';

interface ClientVideoViewContainerProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientVideoViewContainer = ({ 
  clientId, 
  clientName, 
  clientLogoUrl 
}: ClientVideoViewContainerProps) => {
  const containerData = useClientVideoContainer({ clientId });
  
  const callbacks = useClientVideoCallbacks({
    refreshVideos: containerData.refreshVideos,
    setShowReorderMode: containerData.setShowReorderMode,
    setDeletingVideoId: containerData.setDeletingVideoId,
    setShowClientSelector: containerData.setShowClientSelector,
    setSearchValue: containerData.setSearchValue,
    setSelectedClients: containerData.setSelectedClients,
    setShowVideoForm: containerData.setShowVideoForm,
    clearSelection: containerData.clearSelection,
    clearSelectionOnPageChange: containerData.clearSelectionOnPageChange,
    handleDeleteVideo: containerData.handleDeleteVideo,
    handlePageChange: containerData.handlePageChange,
    handleItemsPerPageChange: containerData.handleItemsPerPageChange,
    handleAssignToClients: containerData.handleAssignToClients,
    selectedClients: containerData.selectedClients
  });

  // Loading state
  if (containerData.isLoading) {
    return (
      <ClientVideoLoadingState 
        clientName={clientName} 
        clientLogoUrl={clientLogoUrl} 
      />
    );
  }

  // Reorder mode
  if (containerData.showReorderMode) {
    return (
      <ClientVideoReorderMode
        clientId={clientId}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videos={containerData.videos}
        onExitReorderMode={() => containerData.setShowReorderMode(false)}
        onReorderComplete={callbacks.handleReorderComplete}
      />
    );
  }

  // Main view
  return (
    <>
      <ClientVideoMainView
        clientId={clientId}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videos={containerData.videos}
        paginatedVideos={containerData.paginatedVideos}
        totalPages={containerData.totalPages}
        selectedVideos={containerData.selectedVideos}
        allVisibleVideosSelected={containerData.allVisibleVideosSelected}
        showUsersManager={containerData.showUsersManager}
        showClientSelector={containerData.showClientSelector}
        editingVideoId={containerData.editingVideoId}
        isEditModalOpen={containerData.isEditModalOpen}
        deletingVideoId={containerData.deletingVideoId}
        currentPage={containerData.currentPage}
        itemsPerPage={containerData.itemsPerPage}
        clients={containerData.clients}
        filteredClients={containerData.filteredClients}
        clientsLoading={containerData.clientsLoading}
        searchValue={containerData.searchValue}
        selectedClients={containerData.selectedClients}
        isAssigning={containerData.isAssigning}
        onSelectAllVisible={containerData.handleSelectAllVisible}
        onToggleUsersManager={() => containerData.setShowUsersManager(!containerData.showUsersManager)}
        onShowReorderMode={() => containerData.setShowReorderMode(true)}
        onBulkDelete={containerData.handleBulkDelete}
        onAssignToClients={() => containerData.setShowClientSelector(true)}
        onAddVideo={callbacks.handleAddVideo}
        onVideoSelect={containerData.handleVideoSelect}
        onEditVideo={containerData.handleEditVideo}
        onDeleteVideo={callbacks.handleDeleteVideoWithState}
        onPageChange={callbacks.handlePageChangeWithClear}
        onItemsPerPageChange={callbacks.handleItemsPerPageChangeWithClear}
        onModalClose={callbacks.handleModalClose}
        onConfirmSelection={callbacks.handleConfirmSelection}
        onCloseEditModal={containerData.handleCloseEditModal}
        onSearchValueChange={containerData.setSearchValue}
        onClientToggle={containerData.handleClientToggle}
        onBulkClientChange={containerData.handleBulkClientChange}
      />

      {/* Video Form Modal */}
      <VideoForm
        open={containerData.showVideoForm}
        onOpenChange={containerData.setShowVideoForm}
        onVideoCreated={callbacks.handleVideoCreated}
      />
    </>
  );
};
