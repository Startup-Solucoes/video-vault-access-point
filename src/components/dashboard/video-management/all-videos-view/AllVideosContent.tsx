
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { VideosList } from '../VideosList';
import { VideoListPagination } from '../VideoListPagination';

interface AllVideosContentProps {
  currentPageVideos: any[];
  selectedVideos: string[];
  onVideoSelect: (videoId: string, checked: boolean) => void;
  currentPage: number;
  totalPages: number;
  totalVideos: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const AllVideosContent: React.FC<AllVideosContentProps> = ({
  currentPageVideos,
  selectedVideos,
  onVideoSelect,
  currentPage,
  totalPages,
  totalVideos,
  itemsPerPage,
  onPageChange
}) => {
  return (
    <CardContent>
      <VideosList
        videos={currentPageVideos}
        selectedVideos={selectedVideos}
        onVideoSelect={onVideoSelect}
      />
      
      <VideoListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalVideos={totalVideos}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </CardContent>
  );
};
