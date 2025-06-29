
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Video, 
  Users, 
  Plus, 
  Trash2, 
  UserPlus
} from 'lucide-react';

interface ClientVideoHeaderProps {
  clientName: string;
  clientLogoUrl?: string;
  videosCount: number;
  selectedVideos: string[];
  showUsersManager: boolean;
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
  onToggleUsersManager,
  onBulkDelete,
  onAssignToClients,
  onAddVideo
}: ClientVideoHeaderProps) => {
  const hasSelectedVideos = selectedVideos.length > 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        {/* Cabeçalho do cliente */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {clientLogoUrl && (
              <img
                src={clientLogoUrl}
                alt={`Logo ${clientName}`}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{clientName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Video className="h-3 w-3 mr-1" />
                  {videosCount} vídeos
                </Badge>
              </div>
            </div>
          </div>

          {/* Ações principais */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onToggleUsersManager}
              className={showUsersManager ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
            >
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Usuários
            </Button>
            
            <Button onClick={onAddVideo} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Vídeo
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Ações em lote - aparece apenas quando há vídeos selecionados */}
      {hasSelectedVideos && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {selectedVideos.length} selecionado{selectedVideos.length > 1 ? 's' : ''}
              </Badge>
              <span className="text-sm text-gray-600">Escolha uma ação:</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onAssignToClients}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  Atribuir ({selectedVideos.length})
                </span>
                <span className="sm:hidden">
                  Atribuir
                </span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  Remover ({selectedVideos.length})
                </span>
                <span className="sm:hidden">
                  Remover
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
