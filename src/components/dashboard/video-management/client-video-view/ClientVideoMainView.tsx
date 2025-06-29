
import React from 'react';
import { ClientVideoHeader } from './ClientVideoHeader';
import { ClientVideoUsersSection } from './ClientVideoUsersSection';
import { ClientVideoContent } from './ClientVideoContent';
import { ClientVideoModals } from './ClientVideoModals';
import { ClientVideoFilters } from './ClientVideoFilters';
import { useClientVideoFiltering } from '@/hooks/video-management/useClientVideoFiltering';
import { ClientVideoData } from '@/hooks/useClientVideos';

interface ClientVideoMainViewProps {
  // Client info
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
  
  // Video data
  videos: ClientVideoData[];
  paginatedVideos: ClientVideoData[];
  totalPages: number;
  
  // Selection state
  selectedVideos: string[];
  allVisibleVideosSelected: boolean;
  
  // UI state
  showUsersManager: boolean;
  showClientSelector: boolean;
  editingVideoId: string | null;
  isEditModalOpen: boolean;
  deletingVideoId: string | null;
  currentPage: number;
  itemsPerPage: number;
  
  // Client selector state
  clients: any[];
  filteredClients: any[];
  clientsLoading: boolean;
  searchValue: string;
  selectedClients: string[];
  isAssigning: boolean;
  
  // Handlers
  onSelectAllVisible: () => void;
  onToggleUsersManager: () => void;
  onShowReorderMode: () => void;
  onBulkDelete: () => void;
  onAssignToClients: () => void;
  onAddVideo: () => void;
  onVideoSelect: (videoId: string, checked: boolean) => void;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
  onModalClose: (open: boolean) => void;
  onConfirmSelection: () => void;
  onCloseEditModal: () => void;
  onSearchValueChange: (value: string) => void;
  onClientToggle: (clientId: string) => void;
  onBulkClientChange: (clientIds: string[]) => void;
}

export const ClientVideoMainView = ({
  clientId,
  clientName,
  clientLogoUrl,
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
}: ClientVideoMainViewProps) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    showFilters,
    setShowFilters,
    availableCategories,
    filteredVideos
  } = useClientVideoFiltering(videos);

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <ClientVideoHeader
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videosCount={filteredVideos.length}
        selectedVideos={selectedVideos}
        showUsersManager={showUsersManager}
        onSelectAllVisible={onSelectAllVisible}
        onToggleUsersManager={onToggleUsersManager}
        onShowReorderMode={onShowReorderMode}
        onBulkDelete={onBulkDelete}
        onAssignToClients={onAssignToClients}
        onAddVideo={onAddVideo}
        allVideosSelected={allVisibleVideosSelected}
      />

      {/* Users Manager */}
      <ClientVideoUsersSection
        clientId={clientId}
        clientName={clientName}
        showUsersManager={showUsersManager}
      />

      {/* Filtros de Vídeo */}
      <ClientVideoFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableCategories={availableCategories}
        totalVideos={videos.length}
        filteredVideos={filteredVideos.length}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Videos Content */}
      <ClientVideoContent
        videos={filteredVideos}
        paginatedVideos={paginatedVideos}
        totalPages={totalPages}
        selectedVideos={selectedVideos}
        deletingVideoId={deletingVideoId}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        clientName={clientName}
        onVideoSelect={onVideoSelect}
        onSelectAllVisible={onSelectAllVisible}
        onEditVideo={onEditVideo}
        onDeleteVideo={onDeleteVideo}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />

      {/* Modals */}
      <ClientVideoModals
        showClientSelector={showClientSelector}
        clients={clients}
        filteredClients={filteredClients}
        clientsLoading={clientsLoading}
        searchValue={searchValue}
        selectedClients={selectedClients}
        isAssigning={isAssigning}
        editingVideoId={editingVideoId}
        isEditModalOpen={isEditModalOpen}
        onModalClose={onModalClose}
        onConfirmSelection={onConfirmSelection}
        onCloseEditModal={onCloseEditModal}
        onSearchValueChange={onSearchValueChange}
        onClientToggle={onClientToggle}
        onBulkClientChange={onBulkClientChange}
      />
    </div>
  );
};
