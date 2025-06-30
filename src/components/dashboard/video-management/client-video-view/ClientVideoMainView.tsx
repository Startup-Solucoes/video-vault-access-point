
import React, { useState } from 'react';
import { ClientVideoHeader } from './ClientVideoHeader';
import { ClientVideoContent } from './ClientVideoContent';
import { ClientVideoModals } from './ClientVideoModals';
import { EditClientInfoDialog } from './EditClientInfoDialog';
import { ClientVideoViewProps } from './types';

export const ClientVideoMainView = ({
  clientId,
  clientName: initialClientName,
  clientLogoUrl: initialClientLogoUrl,
  videos,
  paginatedVideos,
  totalPages,
  selectedVideos,
  allVisibleVideosSelected,
  showUsersManager,
  showClientSelector,
  editingVideoId,
  isEditModalOpen,
  deletingVideoId,
  currentPage,
  itemsPerPage,
  clients,
  filteredClients,
  clientsLoading,
  searchValue,
  selectedClients,
  isAssigning,
  onSelectAllVisible,
  onToggleUsersManager,
  onShowReorderMode,
  onBulkDelete,
  onAssignToClients,
  onAddVideo,
  onVideoSelect,
  onEditVideo,
  onDeleteVideo,
  onPageChange,
  onItemsPerPageChange,
  onModalClose,
  onConfirmSelection,
  onCloseEditModal,
  onSearchValueChange,
  onClientToggle,
  onBulkClientChange
}: ClientVideoViewProps) => {
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [currentClientName, setCurrentClientName] = useState(initialClientName);
  const [currentClientLogoUrl, setCurrentClientLogoUrl] = useState(initialClientLogoUrl);

  const handleClientUpdated = (newName: string, newLogoUrl?: string) => {
    setCurrentClientName(newName);
    setCurrentClientLogoUrl(newLogoUrl);
  };

  return (
    <div className="space-y-6">
      <ClientVideoHeader
        clientName={currentClientName}
        clientLogoUrl={currentClientLogoUrl}
        videosCount={videos.length}
        selectedVideos={selectedVideos}
        showUsersManager={showUsersManager}
        onToggleUsersManager={onToggleUsersManager}
        onShowReorderMode={onShowReorderMode}
        onBulkDelete={onBulkDelete}
        onAssignToClients={onAssignToClients}
        onAddVideo={onAddVideo}
        onEditClientInfo={() => setIsEditClientDialogOpen(true)}
      />

      <ClientVideoContent
        videos={videos}
        paginatedVideos={paginatedVideos}
        totalPages={totalPages}
        selectedVideos={selectedVideos}
        allVisibleVideosSelected={allVisibleVideosSelected}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onSelectAllVisible={onSelectAllVisible}
        onVideoSelect={onVideoSelect}
        onEditVideo={onEditVideo}
        onDeleteVideo={onDeleteVideo}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />

      <ClientVideoModals
        showClientSelector={showClientSelector}
        editingVideoId={editingVideoId}
        isEditModalOpen={isEditModalOpen}
        deletingVideoId={deletingVideoId}
        clients={clients}
        filteredClients={filteredClients}
        clientsLoading={clientsLoading}
        searchValue={searchValue}
        selectedClients={selectedClients}
        isAssigning={isAssigning}
        onModalClose={onModalClose}
        onConfirmSelection={onConfirmSelection}
        onCloseEditModal={onCloseEditModal}
        onSearchValueChange={onSearchValueChange}
        onClientToggle={onClientToggle}
        onBulkClientChange={onBulkClientChange}
      />

      <EditClientInfoDialog
        open={isEditClientDialogOpen}
        onOpenChange={setIsEditClientDialogOpen}
        clientId={clientId}
        clientName={currentClientName}
        clientLogoUrl={currentClientLogoUrl}
        onClientUpdated={handleClientUpdated}
      />
    </div>
  );
};
