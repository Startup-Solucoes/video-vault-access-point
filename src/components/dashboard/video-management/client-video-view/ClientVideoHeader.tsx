
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { User, Users, ArrowUpDown, Trash2, UserPlus, MoreVertical } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4">
          {/* Title and Logo */}
          <CardTitle className="flex items-center text-sm md:text-base">
            {clientLogoUrl ? (
              <img 
                src={clientLogoUrl} 
                alt={`Logo ${clientName}`}
                className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 object-contain rounded flex-shrink-0"
              />
            ) : (
              <User className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
            )}
            <span className="truncate">Vídeos de {clientName} ({videosCount})</span>
          </CardTitle>
          
          {/* Selection and Actions */}
          <div className="flex flex-col gap-3">
            {/* Selection controls */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Checkbox
                  checked={allVideosSelected}
                  onCheckedChange={onSelectAllVisible}
                  className="flex-shrink-0"
                />
                <span className="text-xs md:text-sm text-gray-600 truncate">
                  Selecionar todos visíveis
                </span>
              </div>
              
              {selectedVideos.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex-shrink-0">
                  {selectedVideos.length} selecionado{selectedVideos.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {/* Selected videos actions */}
              {selectedVideos.length > 0 && (
                <div className="flex gap-2 flex-shrink-0">
                  {!isMobile ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onAssignToClients}
                        className="flex items-center gap-2 text-xs md:text-sm"
                      >
                        <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
                        Atribuir
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2 text-xs md:text-sm"
                          >
                            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                            Remover
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-sm md:max-w-md mx-4">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-sm md:text-base">Remover vídeos do cliente?</AlertDialogTitle>
                            <AlertDialogDescription className="text-xs md:text-sm">
                              Tem certeza que deseja remover <strong>{selectedVideos.length} vídeo{selectedVideos.length !== 1 ? 's' : ''}</strong> do cliente <strong>{clientName}</strong>?
                              <br /><br />
                              Esta ação irá apenas remover o acesso do cliente a estes vídeos. Os vídeos não serão deletados permanentemente e continuarão disponíveis para outros clientes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                            <AlertDialogCancel className="text-sm">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={onBulkDelete}
                              className="bg-red-600 hover:bg-red-700 text-sm"
                            >
                              Sim, remover do cliente
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  ) : (
                    // Mobile dropdown for selected actions
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs">
                          <MoreVertical className="h-3 w-3" />
                          Ações
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white">
                        <DropdownMenuItem onClick={onAssignToClients}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Atribuir a Clientes
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover Selecionados
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-sm mx-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-sm">Remover vídeos?</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs">
                                Remover {selectedVideos.length} vídeo{selectedVideos.length !== 1 ? 's' : ''} do cliente {clientName}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col-reverse gap-2">
                              <AlertDialogCancel className="text-sm">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={onBulkDelete} className="bg-red-600 hover:bg-red-700 text-sm">
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )}
              
              {/* General actions */}
              <div className="flex gap-2 flex-shrink-0">
                {!isMobile ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleUsersManager}
                      className="flex items-center gap-2 text-xs md:text-sm"
                    >
                      <Users className="h-3 w-3 md:h-4 md:w-4" />
                      {showUsersManager ? 'Ocultar' : 'Gerenciar'} Usuários
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onShowReorderMode}
                      className="flex items-center gap-2 text-xs md:text-sm"
                    >
                      <ArrowUpDown className="h-3 w-3 md:h-4 md:w-4" />
                      Reordenar
                    </Button>
                  </>
                ) : (
                  // Mobile dropdown for general actions
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <MoreVertical className="h-3 w-3" />
                        Menu
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white">
                      <DropdownMenuItem onClick={onToggleUsersManager}>
                        <Users className="h-4 w-4 mr-2" />
                        {showUsersManager ? 'Ocultar' : 'Gerenciar'} Usuários
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onShowReorderMode}>
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Reordenar Vídeos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
