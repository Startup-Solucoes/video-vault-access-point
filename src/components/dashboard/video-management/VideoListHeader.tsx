
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Users, CheckSquare, Square } from 'lucide-react';

interface VideoListHeaderProps {
  totalVideos: number;
  currentVideos: any[];
  selectedVideos: string[];
  itemsPerPage: number;
  onItemsPerPageChange: (value: string) => void;
  onSelectAllVisible: () => void;
  onAssignToClients: () => void;
}

export const VideoListHeader: React.FC<VideoListHeaderProps> = ({
  totalVideos,
  currentVideos,
  selectedVideos,
  itemsPerPage,
  onItemsPerPageChange,
  onSelectAllVisible,
  onAssignToClients
}) => {
  const allCurrentSelected = currentVideos.length > 0 && currentVideos.every(video => selectedVideos.includes(video.id));
  const someCurrentSelected = currentVideos.some(video => selectedVideos.includes(video.id));

  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center space-x-2">
        <Video className="h-5 w-5" />
        <span>Todos os Vídeos ({totalVideos})</span>
      </CardTitle>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Mostrar:</span>
          <Select value={itemsPerPage.toString()} onValueChange={onItemsPerPageChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant={allCurrentSelected ? "default" : "outline"}
          onClick={onSelectAllVisible}
          className="flex items-center space-x-2"
        >
          {allCurrentSelected ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          <span>
            {allCurrentSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </span>
        </Button>
        {selectedVideos.length > 0 && (
          <Button
            onClick={onAssignToClients}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Users className="h-4 w-4" />
            <span>Atribuir para Clientes ({selectedVideos.length})</span>
          </Button>
        )}
      </div>
    </div>
  );
};
