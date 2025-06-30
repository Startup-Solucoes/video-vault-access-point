
import { Client } from '@/types/client';
import { ClientVideoData } from '@/hooks/useClientVideos';

export interface ClientVideoViewProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
  videos: ClientVideoData[];
  paginatedVideos: ClientVideoData[];
  totalPages: number;
  selectedVideos: string[];
  allVisibleVideosSelected: boolean;
  showUsersManager: boolean;
  showClientSelector: boolean;
  editingVideoId: string | null;
  isEditModalOpen: boolean;
  deletingVideoId: string | null;
  currentPage: number;
  itemsPerPage: number;
  clients: Client[];
  filteredClients: Client[];
  clientsLoading: boolean;
  searchValue: string;
  selectedClients: string[];
  isAssigning: boolean;
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
