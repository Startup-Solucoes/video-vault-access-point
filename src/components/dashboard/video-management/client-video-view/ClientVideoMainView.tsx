
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ClientUsersManager } from '@/components/dashboard/client-management/ClientUsersManager';
import { ClientSelectionModal } from '@/components/forms/client-selector/ClientSelectionModal';
import { EditVideoForm } from '@/components/forms/EditVideoForm';
import { ClientVideoHeader } from './ClientVideoHeader';
import { ClientVideoTable } from './ClientVideoTable';
import { ClientVideoCards } from './ClientVideoCards';
import { ClientVideoEmptyState } from './ClientVideoEmptyState';
import { ClientVideoPagination } from './ClientVideoPagination';
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
  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <ClientVideoHeader
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        videosCount={videos.length}
        selectedVideos={selectedVideos}
        showUsersManager={showUsersManager}
        onSelectAllVisible={onSelectAllVisible}
        onToggleUsersManager={onToggleUsersManager}
        onShowReorderMode={onShowReorderMode}
        onBulkDelete={onBulkDelete}
        onAssignToClients={onAssignToClients}
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
            <ClientUsersManager 
              clientId={clientId} 
              clientEmail="placeholder@email.com"
              clientName={clientName}
            />
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
                onVideoSelect={onVideoSelect}
                onSelectAllVisible={onSelectAllVisible}
                onEditVideo={onEditVideo}
                onDeleteVideo={onDeleteVideo}
              />
              
              <ClientVideoCards
                videos={paginatedVideos}
                selectedVideos={selectedVideos}
                deletingVideoId={deletingVideoId}
                clientName={clientName}
                onVideoSelect={onVideoSelect}
                onEditVideo={onEditVideo}
                onDeleteVideo={onDeleteVideo}
              />

              <ClientVideoPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalVideos={videos.length}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Client Selection Modal */}
      <ClientSelectionModal
        open={showClientSelector}
        onOpenChange={onModalClose}
        clients={clients}
        selectedClients={selectedClients}
        onClientToggle={onClientToggle}
        onBulkClientChange={onBulkClientChange}
        isLoading={clientsLoading}
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        filteredClients={filteredClients}
        onConfirmSelection={onConfirmSelection}
        isAssigning={isAssigning}
      />

      {/* Edit Video Modal */}
      {editingVideoId && (
        <EditVideoForm
          open={isEditModalOpen}
          onOpenChange={onCloseEditModal}
          videoId={editingVideoId}
        />
      )}
    </div>
  );
};
