
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  RotateCcw, 
  Trash2, 
  UserPlus, 
  CheckSquare, 
  Square,
  Plus,
  Video
} from 'lucide-react';

interface ClientVideoHeaderProps {
  clientName: string;
  clientLogoUrl?: string;
  videosCount: number;
  selectedVideos: string[];
  showUsersManager: boolean;
  allVideosSelected: boolean;
  onSelectAllVisible: () => void;
  onToggleUsersManager: () => void;
  onShowReorderMode: () => void;
  onBulkDelete: () => void;
  onAssignToClients: () => void;
  onAddVideo: () => void;
}

export const ClientVideoHeader = ({
  clientName,
  clientLogoUrl,
  videosCount,
  selectedVideos,
  showUsersManager,
  allVideosSelected,
  onSelectAllVisible,
  onToggleUsersManager,
  onShowReorderMode,
  onBulkDelete,
  onAssignToClients,
  onAddVideo
}: ClientVideoHeaderProps) => {
  const hasSelectedVideos = selectedVideos.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {clientLogoUrl && (
              <img
                src={clientLogoUrl}
                alt={`${clientName} logo`}
                className="h-12 w-12 rounded-lg object-contain bg-white border border-gray-200"
              />
            )}
            <div>
              <CardTitle className="text-xl text-gray-900">
                Vídeos de {clientName}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {videosCount} vídeo{videosCount !== 1 ? 's' : ''} disponível{videosCount !== 1 ? 'is' : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botão Adicionar Vídeo */}
            <Button
              onClick={onAddVideo}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Vídeo
            </Button>

            {/* Botão Gerenciar Usuários */}
            <Button
              variant={showUsersManager ? "default" : "outline"}
              onClick={onToggleUsersManager}
              className={showUsersManager ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Users className="h-4 w-4 mr-2" />
              {showUsersManager ? 'Ocultar Usuários' : 'Gerenciar Usuários'}
            </Button>

            {/* Botão Reordenar */}
            <Button
              variant="outline"
              onClick={onShowReorderMode}
              disabled={videosCount === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reordenar
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Seção de ações em lote */}
      {videosCount > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={allVideosSelected}
                  onCheckedChange={onSelectAllVisible}
                />
                <span className="text-sm text-gray-600">
                  Selecionar todos visíveis
                </span>
              </div>
              
              {hasSelectedVideos && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedVideos.length} selecionado{selectedVideos.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {hasSelectedVideos && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAssignToClients}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Atribuir a Clientes
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBulkDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover Selecionados
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
