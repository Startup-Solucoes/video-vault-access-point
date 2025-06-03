
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Eye, User, Edit, Trash2, Users, ArrowUpDown } from 'lucide-react';
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
      <Card>
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
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showReorderMode) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              {videos.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReorderMode(true)}
                  className="flex items-center gap-2"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Reordenar Vídeos
                </Button>
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
          <p className="text-gray-600 mt-2">
            {videos.length} vídeo{videos.length !== 1 ? 's' : ''} disponível{videos.length !== 1 ? 'eis' : ''}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gerenciamento de Usuários */}
          {showUsersManager && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gerenciar Usuários do Cliente
              </h4>
              <ClientUsersManager clientId={clientId} />
            </div>
          )}

          {/* Lista de Vídeos */}
          {videos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum vídeo disponível para este cliente</p>
              <p className="text-sm">Adicione permissões de vídeos para este cliente</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ordem</TableHead>
                    <TableHead className="w-[300px]">Título e Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Data de Acesso</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video, index) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <Badge variant="outline">
                          #{video.display_order || index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900">{video.title}</div>
                          {video.description && (
                            <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                              {video.description}
                            </div>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
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
                          <span>0 visualizações</span>
                          <span className="text-xs text-gray-400 ml-1">(em breve)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end space-x-2">
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
    </>
  );
};
