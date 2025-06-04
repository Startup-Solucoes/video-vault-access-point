
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useClientVideos } from '@/hooks/useClientVideos';
import { EditVideoForm } from '@/components/forms/EditVideoForm';
import { ClientUsersManager } from '@/components/dashboard/client-management/ClientUsersManager';
import { VideoReorderList } from '../VideoReorderList';
import { ClientVideoHeader } from './ClientVideoHeader';
import { ClientVideoTable } from './ClientVideoTable';
import { ClientVideoCards } from './ClientVideoCards';
import { ClientVideoEmptyState } from './ClientVideoEmptyState';
import { ClientVideoPagination } from './ClientVideoPagination';
import { useClientVideoSelection } from './ClientVideoSelectionManager';
import { useClientVideoActions } from './ClientVideoActions';

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
  const { videos, isLoading, refreshVideos } = useClientVideos(clientId);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showUsersManager, setShowUsersManager] = useState(false);
  const [showReorderMode, setShowReorderMode] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

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

  // Reset da página quando mudamos o número de itens por página
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    clearSelectionOnPageChange();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    clearSelectionOnPageChange();
  };

  const handleDeleteVideoWithState = async (videoId: string, videoTitle: string) => {
    setDeletingVideoId(videoId);
    try {
      await handleDeleteVideo(videoId, videoTitle);
    } finally {
      setDeletingVideoId(null);
    }
  };

  const handleEditVideo = (videoId: string) => {
    setEditingVideoId(videoId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVideoId(null);
  };

  const handleReorderComplete = () => {
    refreshVideos();
    setShowReorderMode(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            {clientLogoUrl ? (
              <img 
                src={clientLogoUrl} 
                alt={`Logo ${clientName}`}
                className="h-8 w-8 mr-3 object-contain rounded"
              />
            ) : (
              <User className="h-5 w-5 mr-2" />
            )}
            Vídeos de {clientName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500">Carregando vídeos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showReorderMode) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center">
              {clientLogoUrl ? (
                <img 
                  src={clientLogoUrl} 
                  alt={`Logo ${clientName}`}
                  className="h-8 w-8 mr-3 object-contain rounded"
                />
              ) : (
                <User className="h-5 w-5 mr-2" />
              )}
              Reordenar Vídeos - {clientName}
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowReorderMode(false)}
              size="sm"
            >
              Voltar para Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VideoReorderList
            clientId={clientId}
            clientName={clientName}
            videos={videos}
            onReorderComplete={handleReorderComplete}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <ClientVideoHeader
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videosCount={videos.length}
        selectedVideos={selectedVideos}
        showUsersManager={showUsersManager}
        onSelectAllVisible={handleSelectAllVisible}
        onToggleUsersManager={() => setShowUsersManager(!showUsersManager)}
        onShowReorderMode={() => setShowReorderMode(true)}
        onBulkDelete={handleBulkDelete}
        allVideosSelected={allVisibleVideosSelected}
      />

      {/* Users Manager */}
      {showUsersManager && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Gerenciar Usuários do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientUsersManager clientId={clientId} />
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <Card className="w-full">
        <CardContent className="p-6">
          {videos.length === 0 ? (
            <ClientVideoEmptyState />
          ) : (
            <>
              <ClientVideoTable
                videos={paginatedVideos}
                selectedVideos={selectedVideos}
                deletingVideoId={deletingVideoId}
                clientName={clientName}
                onVideoSelect={handleVideoSelect}
                onSelectAllVisible={handleSelectAllVisible}
                onEditVideo={handleEditVideo}
                onDeleteVideo={handleDeleteVideoWithState}
              />
              
              <ClientVideoCards
                videos={paginatedVideos}
                selectedVideos={selectedVideos}
                deletingVideoId={deletingVideoId}
                clientName={clientName}
                onVideoSelect={handleVideoSelect}
                onEditVideo={handleEditVideo}
                onDeleteVideo={handleDeleteVideoWithState}
              />

              <ClientVideoPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalVideos={videos.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {editingVideoId && (
        <EditVideoForm
          open={isEditModalOpen}
          onOpenChange={handleCloseEditModal}
          videoId={editingVideoId}
        />
      )}
    </div>
  );
};
