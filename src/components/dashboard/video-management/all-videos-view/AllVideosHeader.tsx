
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { VideoListHeader } from '../VideoListHeader';

interface AllVideosHeaderProps {
  totalVideos: number;
  currentVideos: any[];
  selectedVideos: string[];
  itemsPerPage: number;
  onItemsPerPageChange: (value: string) => void;
  onSelectAllVisible: () => void;
  onAssignToClients: () => void;
}

export const AllVideosHeader: React.FC<AllVideosHeaderProps> = (props) => {
  return (
    <CardHeader>
      <VideoListHeader {...props} />
    </CardHeader>
  );
};
