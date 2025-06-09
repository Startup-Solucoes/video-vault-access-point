
import { useState } from 'react';

export const useClientVideoViewState = () => {
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showUsersManager, setShowUsersManager] = useState(false);
  const [showReorderMode, setShowReorderMode] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [showClientSelector, setShowClientSelector] = useState(false);

  const handleEditVideo = (videoId: string) => {
    setEditingVideoId(videoId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVideoId(null);
  };

  const handleItemsPerPageChange = (value: string, clearSelectionOnPageChange: () => void) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    clearSelectionOnPageChange();
  };

  const handlePageChange = (page: number, clearSelectionOnPageChange: () => void) => {
    setCurrentPage(page);
    clearSelectionOnPageChange();
  };

  return {
    // States
    editingVideoId,
    isEditModalOpen,
    showUsersManager,
    showReorderMode,
    deletingVideoId,
    currentPage,
    itemsPerPage,
    showClientSelector,
    
    // Setters
    setEditingVideoId,
    setIsEditModalOpen,
    setShowUsersManager,
    setShowReorderMode,
    setDeletingVideoId,
    setCurrentPage,
    setItemsPerPage,
    setShowClientSelector,
    
    // Handlers
    handleEditVideo,
    handleCloseEditModal,
    handleItemsPerPageChange,
    handlePageChange
  };
};
