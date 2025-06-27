
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClientVideoTable } from './ClientVideoTable';
import { ClientVideoCards } from './ClientVideoCards';
import { ClientVideoEmptyState } from './ClientVideoEmptyState';
import { ClientVideoPagination } from './ClientVideoPagination';
import { ClientVideoData } from '@/hooks/useClientVideos';

interface ClientVideoContentProps {
  videos: ClientVideoData[];
  paginatedVideos: ClientVideoData[];
  totalPages: number;
  selectedVideos: string[];
  deletingVideoId: string | null;
  currentPage: number;
  itemsPerPage: number;
  clientName: string;
  onVideoSelect: (videoId: string, checked: boolean) => void;
  onSelectAllVisible: () => void;
  onEditVideo: (videoId: string) => void;
  onDeleteVideo: (videoId: string, videoTitle: string) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: string) => void;
}

export const ClientVideoContent = ({
  videos,
  paginatedVideos,
  totalPages,
  selectedVideos,
  deletingVideoId,
  currentPage,
  itemsPerPage,
  clientName,
  onVideoSelect,
  onSelectAllVisible,
  onEditVideo,
  onDeleteVideo,
  onPageChange,
  onItemsPerPageChange
}: ClientVideoContentProps) => {
  return (
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
  );
};
