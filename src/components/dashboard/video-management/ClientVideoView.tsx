import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Video, Calendar, Eye, User, Edit, Trash2, Users, ArrowUpDown, CheckSquare, Square } from 'lucide-react';
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
import { useClientVideos } from '@/hooks/useClientVideos';
import { EditVideoForm } from '@/components/forms/EditVideoForm';
import { ClientUsersManager } from '@/components/dashboard/client-management/ClientUsersManager';
import { VideoReorderList } from './VideoReorderList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClientVideoViewProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientVideoView = ({ clientId, clientName, clientLogoUrl }: ClientVideoViewProps) => {
  const { videos, isLoading, refreshVideos } = useClientVideos(clientId);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showUsersManager, setShowUsersManager] = useState(false);
  const [showReorderMode, setShowReorderMode] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAllVisible = () => {
    const allSelected = videos.every(video => selectedVideos.includes(video.id));
    if (allSelected) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(video => video.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVideos.length === 0) return;
    
    console.log('🗑️ Iniciando exclusão em lote:', { selectedVideos, clientId });

    try {
      // Deletar todas as permissões selecionadas
      const { error } = await supabase
        .from('video_permissions')
        .delete()
        .eq('client_id', clientId)
        .in('video_id', selectedVideos);

      if (error) {
        console.error('❌ Erro ao deletar permissões:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover vídeos do cliente",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Permissões deletadas com sucesso');
      
      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) removido(s) do cliente com sucesso`,
      });

      // Limpar seleção e atualizar lista
      setSelectedVideos([]);
      refreshVideos();
      
    } catch (error) {
      console.error('💥 Erro inesperado ao deletar vídeos:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao remover vídeos",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async (videoId: string, videoTitle: string) => {
    console.log('🗑️ Iniciando exclusão do vídeo:', { videoId, videoTitle, clientId });
    setDeletingVideoId(videoId);

    try {
      // Buscar a permissão específica para este cliente e vídeo
      const { data: permission, error: permissionError } = await supabase
        .from('video_permissions')
        .select('id')
        .eq('video_id', videoId)
        .eq('client_id', clientId)
        .single();

      if (permissionError) {
        console.error('❌ Erro ao buscar permissão:', permissionError);
        toast({
          title: "Erro",
          description: "Erro ao buscar permissão do vídeo",
          variant: "destructive",
        });
        return;
      }

      console.log('🔍 Permissão encontrada:', permission);

      // Deletar apenas a permissão (não o vídeo em si)
      const { error: deleteError } = await supabase
        .from('video_permissions')
        .delete()
        .eq('id', permission.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar permissão:', deleteError);
        toast({
          title: "Erro",
          description: "Erro ao remover vídeo do cliente",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Permissão deletada com sucesso');
      
      toast({
        title: "Sucesso",
        description: `Vídeo "${videoTitle}" removido do cliente com sucesso`,
      });

      // Atualizar a lista de vídeos
      refreshVideos();
      
    } catch (error) {
      console.error('💥 Erro inesperado ao deletar vídeo:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao remover vídeo",
        variant: "destructive",
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  const handleEditVideo = (videoId: string) => {
    setEditingVideoId(videoId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVideoId(null);
  };

  const handleReorderComplete = () => {
    refreshVideos();
    setShowReorderMode(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
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
            Vídeos de {clientName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500">Carregando vídeos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showReorderMode) {
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
              Reordenar Vídeos - {clientName}
            </CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowReorderMode(false)}
              size="sm"
            >
              Voltar para Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VideoReorderList
            clientId={clientId}
            clientName={clientName}
            videos={videos}
            onReorderComplete={handleReorderComplete}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header Card */}
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
                {videos.length} vídeo{videos.length !== 1 ? 's' : ''} disponível{videos.length !== 1 ? 'eis' : ''}
                {selectedVideos.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    • {selectedVideos.length} selecionado{selectedVideos.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {videos.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllVisible}
                    className="flex items-center gap-2"
                  >
                    {videos.every(video => selectedVideos.includes(video.id)) ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                    {videos.every(video => selectedVideos.includes(video.id)) ? 'Desmarcar Todos' : 'Selecionar Todos'}
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
                            onClick={handleBulkDelete}
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
                    onClick={() => setShowReorderMode(true)}
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
                onClick={() => setShowUsersManager(!showUsersManager)}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {showUsersManager ? 'Ocultar Usuários' : 'Gerenciar Usuários'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Gerenciamento de Usuários */}
      {showUsersManager && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Gerenciar Usuários do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientUsersManager clientId={clientId} />
          </CardContent>
        </Card>
      )}

      {/* Lista de Vídeos */}
      <Card className="w-full">
        <CardContent className="p-6">
          {videos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum vídeo disponível para este cliente
              </h3>
              <p className="text-gray-500">
                Adicione permissões de vídeos para este cliente
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={videos.length > 0 && videos.every(video => selectedVideos.includes(video.id))}
                          onCheckedChange={handleSelectAllVisible}
                        />
                      </TableHead>
                      <TableHead className="w-20">Ordem</TableHead>
                      <TableHead className="min-w-[300px]">Título e Descrição</TableHead>
                      <TableHead className="w-32">Categoria</TableHead>
                      <TableHead className="w-40">Data de Criação</TableHead>
                      <TableHead className="w-40">Data de Acesso</TableHead>
                      <TableHead className="w-32">Visualizações</TableHead>
                      <TableHead className="w-32 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {videos.map((video, index) => (
                      <TableRow key={video.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedVideos.includes(video.id)}
                            onCheckedChange={(checked) => handleVideoSelect(video.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            #{video.display_order || index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="font-medium text-gray-900 line-clamp-2">{video.title}</div>
                            {video.description && (
                              <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                                {video.description}
                              </div>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => window.open(video.video_url, '_blank')}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Visualizar
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {video.category ? (
                            <Badge variant="secondary">{video.category}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">Sem categoria</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(video.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(video.permission_created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Eye className="h-4 w-4 mr-1" />
                            <div className="flex flex-col">
                              <span>0 visualizações</span>
                              <span className="text-xs text-gray-400">(em breve)</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditVideo(video.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={deletingVideoId === video.id}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover vídeo do cliente?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover o vídeo <strong>"{video.title}"</strong> do cliente <strong>{clientName}</strong>?
                                    <br /><br />
                                    Esta ação irá apenas remover o acesso do cliente a este vídeo. O vídeo não será deletado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteVideo(video.id, video.title)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Sim, remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden space-y-4">
                {videos.map((video, index) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {/* Header with checkbox, order and actions */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedVideos.includes(video.id)}
                              onCheckedChange={(checked) => handleVideoSelect(video.id, checked as boolean)}
                            />
                            <Badge variant="outline" className="text-xs">
                              #{video.display_order || index + 1}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditVideo(video.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={deletingVideoId === video.id}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover vídeo do cliente?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover o vídeo <strong>"{video.title}"</strong> do cliente <strong>{clientName}</strong>?
                                    <br /><br />
                                    Esta ação irá apenas remover o acesso do cliente a este vídeo. O vídeo não será deletado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteVideo(video.id, video.title)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Sim, remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>

                        {/* Title and description */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                          {video.description && (
                            <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                              {video.description}
                            </p>
                          )}
                        </div>

                        {/* Category */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Categoria:</span>
                          {video.category ? (
                            <Badge variant="secondary" className="text-xs">{video.category}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">Sem categoria</span>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <div>
                              <div className="font-medium">Criado em:</div>
                              <div>{formatDate(video.created_at)}</div>
                            </div>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <div>
                              <div className="font-medium">Acesso em:</div>
                              <div>{formatDate(video.permission_created_at)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Visualizations and View button */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center text-sm text-gray-600">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>0 visualizações</span>
                            <span className="text-xs text-gray-400 ml-1">(em breve)</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => window.open(video.video_url, '_blank')}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Visualizar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {editingVideoId && (
        <EditVideoForm
          open={isEditModalOpen}
          onOpenChange={handleCloseEditModal}
          videoId={editingVideoId}
        />
      )}
    </div>
  );
};
