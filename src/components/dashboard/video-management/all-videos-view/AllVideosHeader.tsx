
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { VideoListHeader } from '../VideoListHeader';
import { SearchBar } from '../SearchBar';

interface AllVideosHeaderProps {
  totalVideos: number;
  currentVideos: any[];
  selectedVideos: string[];
  itemsPerPage: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onItemsPerPageChange: (value: string) => void;
  onSelectAllVisible: () => void;
  onAssignToClients: () => void;
}

export const AllVideosHeader: React.FC<AllVideosHeaderProps> = ({
  searchValue,
  onSearchChange,
  ...props
}) => {
  return (
    <CardHeader className="space-y-4">
      <VideoListHeader {...props} />
      
      {/* Barra de Busca */}
      <SearchBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        placeholder="Buscar vídeo por título..."
        className="max-w-md"
      />
    </CardHeader>
  );
};
