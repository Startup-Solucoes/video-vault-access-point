
import { useState } from 'react';
import { useClientSelector } from '@/hooks/useClientSelector';
import { useVideosData } from './video-management/useVideosData';
import { useVideoFiltering } from './video-management/useVideoFiltering';
import { usePagination } from './video-management/usePagination';
import { useVideoSelection } from './video-management/useVideoSelection';
import { useVideoAssignment } from './video-management/useVideoAssignment';

export const useAllVideosState = () => {
  const {
    clients,
    filteredClients,
    isLoading: clientsLoading,
    searchValue: clientSearchValue,
    setSearchValue: setClientSearchValue
  } = useClientSelector();
  
  const [showClientSelector, setShowClientSelector] = useState(false);

  // Buscar dados dos vídeos
  const { allVideos, isLoading } = useVideosData();

  // Filtrar vídeos
  const { videoSearchValue, setVideoSearchValue, filteredVideos } = useVideoFiltering(allVideos);

  // Gerenciar seleção de vídeos
  const { 
    selectedVideos, 
    handleVideoSelect, 
    handleSelectAllVisible: handleSelectAllVisibleBase,
    clearSelectedVideos 
  } = useVideoSelection();

  // Gerenciar atribuição de vídeos
  const {
    selectedClients,
    isAssigning,
    handleClientToggle,
    handleBulkClientChange,
    handleAssignToClients: handleAssignToClientsBase,
    clearSelectedClients
  } = useVideoAssignment();

  // Gerenciar paginação
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handleItemsPerPageChange: handleItemsPerPageChangeBase
  } = usePagination(filteredVideos.length, clearSelectedVideos);

  // Calcular dados da página atual
  const totalItems = filteredVideos.length;
  const currentPageVideos = filteredVideos.slice(startIndex, endIndex);

  // Adaptar handlers para manter compatibilidade
  const handleSelectAllVisible = () => {
    handleSelectAllVisibleBase(currentPageVideos);
  };

  const handleItemsPerPageChange = (value: string) => {
    handleItemsPerPageChangeBase(value);
    clearSelectedVideos();
  };

  const handleModalClose = (open: boolean) => {
    setShowClientSelector(open);
    if (!open) {
      setClientSearchValue('');
    }
  };

  const handleConfirmSelection = async () => {
    console.log('=== CONFIRMANDO SELEÇÃO ===');
    console.log('Clientes selecionados no modal:', selectedClients);
    
    setShowClientSelector(false);
    const result = await handleAssignToClientsBase(selectedVideos);
    
    if (result.success && result.cleared) {
      clearSelectedVideos();
      clearSelectedClients();
    }
  };

  return {
    // Data
    allVideos: filteredVideos,
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
    searchValue: clientSearchValue,
    videoSearchValue,
    
    // Handlers
    handleVideoSelect,
    handleSelectAllVisible,
    handleClientToggle,
    handleBulkClientChange,
    handleAssignToClients: () => handleAssignToClientsBase(selectedVideos),
    handleItemsPerPageChange,
    handlePageChange,
    handleModalClose,
    handleConfirmSelection,
    setSearchValue: setClientSearchValue,
    setVideoSearchValue,
    setShowClientSelector
  };
};
