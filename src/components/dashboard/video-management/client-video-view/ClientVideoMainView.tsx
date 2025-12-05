
import React, { useState, useMemo } from 'react';
import { ClientVideoHeader } from './ClientVideoHeader';
import { ClientVideoFilters } from './ClientVideoFilters';
import { ClientVideoContent } from './ClientVideoContent';
import { ClientVideoModals } from './ClientVideoModals';
import { ClientInfoAdapter } from './ClientInfoAdapter';
import { ClientVideoViewProps } from './types';
import { categories } from '@/components/forms/video-form/VideoFormTypes';

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
  
  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleClientUpdated = (newName: string, newLogoUrl?: string) => {
    setCurrentClientName(newName);
    setCurrentClientLogoUrl(newLogoUrl);
  };

  // Handler para mudança de categoria (reseta para página 1)
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onPageChange(1);
  };

  // Handler para mudança de busca (reseta para página 1)
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    onPageChange(1);
  };

  // Calcular contagem de vídeos por categoria
  const videoCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    videos.forEach(video => {
      const category = video.category || 'Sem categoria';
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [videos]);

  // Filtrar vídeos por categoria e termo de busca
  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesCategory = !selectedCategory || video.category === selectedCategory;
      const matchesSearch = !searchTerm.trim() || 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [videos, selectedCategory, searchTerm]);

  // Paginar os vídeos filtrados
  const filteredPaginatedVideos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVideos.slice(start, start + itemsPerPage);
  }, [filteredVideos, currentPage, itemsPerPage]);

  const filteredTotalPages = Math.ceil(filteredVideos.length / itemsPerPage);

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

      <ClientVideoFilters
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleCategoryChange}
        availableCategories={categories}
        videoCategoryCounts={videoCategoryCounts}
        totalVideos={videos.length}
        filteredVideos={filteredVideos.length}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedVideos={selectedVideos}
        allVideosSelected={allVisibleVideosSelected}
        onSelectAllVisible={onSelectAllVisible}
        onShowReorderMode={onShowReorderMode}
      />

      <ClientVideoContent
        videos={filteredVideos}
        paginatedVideos={filteredPaginatedVideos}
        totalPages={filteredTotalPages}
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

      <ClientInfoAdapter
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
