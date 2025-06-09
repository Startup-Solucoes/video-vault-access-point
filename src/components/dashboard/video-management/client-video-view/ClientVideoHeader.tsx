
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Users, ArrowUpDown, Trash2, UserPlus } from 'lucide-react';

interface ClientVideoHeaderProps {
  clientName: string;
  clientLogoUrl?: string;
  videosCount: number;
  selectedVideos: string[];
  showUsersManager: boolean;
  onSelectAllVisible: () => void;
  onToggleUsersManager: () => void;
  onShowReorderMode: () => void;
  onBulkDelete: () => void;
  onAssignToClients: () => void;
  allVideosSelected: boolean;
}

export const ClientVideoHeader = ({
  clientName,
  clientLogoUrl,
  videosCount,
  selectedVideos,
  showUsersManager,
  onSelectAllVisible,
  onToggleUsersManager,
  onShowReorderMode,
  onBulkDelete,
  onAssignToClients,
  allVideosSelected
}: ClientVideoHeaderProps) => {
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
            Vídeos de {clientName} ({videosCount})
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Seleção em massa e ações */}
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={allVideosSelected}
                  onCheckedChange={onSelectAllVisible}
                />
                <span className="text-sm text-gray-600">
                  Selecionar todos visíveis
                </span>
              </div>
              
              {selectedVideos.length > 0 && (
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {selectedVideos.length} selecionado{selectedVideos.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex gap-2">
              {selectedVideos.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onAssignToClients}
                    className="flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Atribuir a Clientes
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onBulkDelete}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover Selecionados
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleUsersManager}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {showUsersManager ? 'Ocultar' : 'Gerenciar'} Usuários
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onShowReorderMode}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="h-4 w-4" />
                Reordenar
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
