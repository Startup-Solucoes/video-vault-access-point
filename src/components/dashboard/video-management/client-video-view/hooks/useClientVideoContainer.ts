
import { useState, useCallback } from 'react';
import { useClientVideos } from '@/hooks/useClientVideos';
import { useClientSelector } from '@/hooks/useClientSelector';
import { useClientVideoSelection } from '../ClientVideoSelectionManager';
import { useClientVideoActions } from '../ClientVideoActions';
import { useClientVideoAssignment } from '../ClientVideoAssignment';
import { useClientVideoViewState } from '../useClientVideoViewState';

interface UseClientVideoContainerProps {
  clientId: string;
}

export const useClientVideoContainer = ({ clientId }: UseClientVideoContainerProps) => {
  const { videos, isLoading, refreshVideos } = useClientVideos(clientId);
  const [showVideoForm, setShowVideoForm] = useState(false);
  
  const {
    clients,
    filteredClients,
    isLoading: clientsLoading,
    searchValue,
    setSearchValue
  } = useClientSelector();

  const {
    editingVideoId,
    isEditModalOpen,
    showUsersManager,
    showReorderMode,
    deletingVideoId,
    currentPage,
    itemsPerPage,
    showClientSelector,
    setShowUsersManager,
    setShowReorderMode,
    setDeletingVideoId,
    setShowClientSelector,
    handleEditVideo,
    handleCloseEditModal,
    handleItemsPerPageChange,
    handlePageChange
  } = useClientVideoViewState();

  const {
    selectedVideos,
    paginatedVideos,
    totalPages,
    handleVideoSelect,
    handleSelectAllVisible,
    clearSelection,
    clearSelectionOnPageChange,
    allVisibleVideosSelected
  } = useClientVideoSelection({ videos, currentPage, itemsPerPage });

  const { handleBulkDelete, handleDeleteVideo } = useClientVideoActions({
    clientId,
    selectedVideos,
    onRefreshVideos: refreshVideos,
    onClearSelection: clearSelection
  });

  const {
    selectedClients,
    setSelectedClients,
    isAssigning,
    handleClientToggle,
    handleBulkClientChange,
    handleAssignToClients
  } = useClientVideoAssignment({
    selectedVideos,
    onSuccess: () => {
      clearSelection();
      setShowClientSelector(false);
      refreshVideos();
    }
  });

  return {
    // Data
    videos,
    isLoading,
    refreshVideos,
    paginatedVideos,
    totalPages,
    
    // Client data
    clients,
    filteredClients,
    clientsLoading,
    searchValue,
    setSearchValue,
    
    // UI state
    showVideoForm,
    setShowVideoForm,
    editingVideoId,
    isEditModalOpen,
    showUsersManager,
    showReorderMode,
    deletingVideoId,
    currentPage,
    itemsPerPage,
    showClientSelector,
    
    // Selection state
    selectedVideos,
    allVisibleVideosSelected,
    selectedClients,
    setSelectedClients,
    isAssigning,
    
    // State setters
    setShowUsersManager,
    setShowReorderMode,
    setDeletingVideoId,
    setShowClientSelector,
    
    // Handlers
    handleEditVideo,
    handleCloseEditModal,
    handleItemsPerPageChange,
    handlePageChange,
    handleVideoSelect,
    handleSelectAllVisible,
    clearSelection,
    clearSelectionOnPageChange,
    handleBulkDelete,
    handleDeleteVideo,
    handleClientToggle,
    handleBulkClientChange,
    handleAssignToClients
  };
};
