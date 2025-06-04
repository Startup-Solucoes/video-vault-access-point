
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Users, ArrowUpDown, CheckSquare, Square, Trash2 } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

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
  allVideosSelected
}: ClientVideoHeaderProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center text-xl">
              {clientLogoUrl ? (
                <img 
                  src={clientLogoUrl} 
                  alt={`Logo ${clientName}`}
                  className="h-8 w-8 mr-3 object-contain rounded"
                />
              ) : (
                <User className="h-5 w-5 mr-2" />
              )}
              Vídeos de {clientName}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {videosCount} vídeo{videosCount !== 1 ? 's' : ''} disponível{videosCount !== 1 ? 'eis' : ''}
              {selectedVideos.length > 0 && (
                <span className="ml-2 text-blue-600">
                  • {selectedVideos.length} selecionado{selectedVideos.length !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {videosCount > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSelectAllVisible}
                  className="flex items-center gap-2"
                >
                  {allVideosSelected ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  {allVideosSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </Button>
                {selectedVideos.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remover Selecionados ({selectedVideos.length})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover vídeos selecionados?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover <strong>{selectedVideos.length} vídeo(s)</strong> do cliente <strong>{clientName}</strong>?
                          <br /><br />
                          Esta ação irá apenas remover o acesso do cliente a estes vídeos. Os vídeos não serão deletados permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onBulkDelete}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sim, remover todos
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowReorderMode}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Reordenar Vídeos
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
              {showUsersManager ? 'Ocultar Usuários' : 'Gerenciar Usuários'}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
