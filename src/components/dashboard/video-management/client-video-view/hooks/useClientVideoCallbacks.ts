
import { useCallback } from 'react';

interface UseClientVideoCallbacksProps {
  refreshVideos: () => void;
  setShowReorderMode: (show: boolean) => void;
  setDeletingVideoId: (id: string | null) => void;
  setShowClientSelector: (show: boolean) => void;
  setSearchValue: (value: string) => void;
  setSelectedClients: (clients: string[]) => void;
  setShowVideoForm: (show: boolean) => void;
  clearSelection: () => void;
  clearSelectionOnPageChange: () => void;
  handleDeleteVideo: (videoId: string, videoTitle: string) => Promise<void>;
  handlePageChange: (page: number, clearSelectionCallback: () => void) => void;
  handleItemsPerPageChange: (value: string, clearSelectionCallback: () => void) => void;
  handleAssignToClients: () => void;
  selectedClients: string[];
}

export const useClientVideoCallbacks = ({
  refreshVideos,
  setShowReorderMode,
  setDeletingVideoId,
  setShowClientSelector,
  setSearchValue,
  setSelectedClients,
  setShowVideoForm,
  clearSelection,
  clearSelectionOnPageChange,
  handleDeleteVideo,
  handlePageChange,
  handleItemsPerPageChange,
  handleAssignToClients,
  selectedClients
}: UseClientVideoCallbacksProps) => {
  const handleDeleteVideoWithState = useCallback(async (videoId: string, videoTitle: string) => {
    setDeletingVideoId(videoId);
    try {
      await handleDeleteVideo(videoId, videoTitle);
    } finally {
      setDeletingVideoId(null);
    }
  }, [handleDeleteVideo, setDeletingVideoId]);

  const handleReorderComplete = useCallback(() => {
    refreshVideos();
    setShowReorderMode(false);
  }, [refreshVideos, setShowReorderMode]);

  const handleModalClose = useCallback((open: boolean) => {
    setShowClientSelector(open);
    if (!open) {
      setSearchValue('');
      setSelectedClients([]);
    }
  }, [setShowClientSelector, setSearchValue, setSelectedClients]);

  const handleConfirmSelection = useCallback(() => {
    console.log('=== CONFIRMANDO SELEÇÃO ===');
    console.log('Clientes selecionados no modal:', selectedClients);
    
    setShowClientSelector(false);
    handleAssignToClients();
  }, [selectedClients, setShowClientSelector, handleAssignToClients]);

  const handleAddVideo = useCallback(() => {
    setShowVideoForm(true);
  }, [setShowVideoForm]);

  const handleVideoCreated = useCallback(() => {
    refreshVideos();
    setShowVideoForm(false);
  }, [refreshVideos, setShowVideoForm]);

  const handlePageChangeWithClear = useCallback((page: number) => {
    handlePageChange(page, clearSelectionOnPageChange);
  }, [handlePageChange, clearSelectionOnPageChange]);

  const handleItemsPerPageChangeWithClear = useCallback((value: string) => {
    handleItemsPerPageChange(value, clearSelectionOnPageChange);
  }, [handleItemsPerPageChange, clearSelectionOnPageChange]);

  return {
    handleDeleteVideoWithState,
    handleReorderComplete,
    handleModalClose,
    handleConfirmSelection,
    handleAddVideo,
    handleVideoCreated,
    handlePageChangeWithClear,
    handleItemsPerPageChangeWithClear
  };
};
