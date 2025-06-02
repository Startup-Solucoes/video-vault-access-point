
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClientSelector } from '@/hooks/useClientSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Calendar, Tag, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { ClientSelectionModal } from '@/components/forms/client-selector/ClientSelectionModal';
import { toast } from '@/hooks/use-toast';

interface VideoData {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  platform?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  created_by: string;
}

export const AllVideosView = () => {
  const {
    clients,
    filteredClients,
    isLoading: clientsLoading,
    searchValue,
    setSearchValue
  } = useClientSelector();
  
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: allVideos = [], isLoading } = useQuery({
    queryKey: ['all-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as VideoData[];
    }
  });

  // Calcular paginação
  const totalPages = Math.ceil(allVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const videos = allVideos.slice(startIndex, endIndex);

  const handleVideoSelect = (videoId: string, checked: boolean) => {
    if (checked) {
      setSelectedVideos(prev => [...prev, videoId]);
    } else {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    }
  };

  const handleSelectAll = () => {
    if (selectedVideos.length === videos.length) {
      setSelectedVideos([]);
    } else {
      setSelectedVideos(videos.map(video => video.id));
    }
  };

  const handleSelectAllVisible = () => {
    const currentPageVideoIds = videos.map(video => video.id);
    const allCurrentSelected = currentPageVideoIds.every(id => selectedVideos.includes(id));
    
    if (allCurrentSelected) {
      setSelectedVideos(prev => prev.filter(id => !currentPageVideoIds.includes(id)));
    } else {
      setSelectedVideos(prev => [...new Set([...prev, ...currentPageVideoIds])]);
    }
  };

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleBulkClientChange = (clientIds: string[]) => {
    setSelectedClients(clientIds);
  };

  const handleAssignToClients = async () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um cliente",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const permissions = selectedVideos.flatMap(videoId =>
        selectedClients.map(clientId => ({
          video_id: videoId,
          client_id: clientId,
          granted_by: user.id
        }))
      );

      const { error } = await supabase
        .from('video_permissions')
        .insert(permissions);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) atribuído(s) para ${selectedClients.length} cliente(s)`,
      });

      setSelectedVideos([]);
      setSelectedClients([]);
      setShowClientSelector(false);
    } catch (error) {
      console.error('Erro ao atribuir vídeos:', error);
      toast({
        title: "Erro",
        description: "Erro ao atribuir vídeos aos clientes",
        variant: "destructive"
      });
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
    setSelectedVideos([]);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setSelectedVideos([]);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando vídeos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Todos os Vídeos ({allVideos.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mostrar:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
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
                variant="outline"
                onClick={handleSelectAllVisible}
              >
                {videos.every(video => selectedVideos.includes(video.id)) ? 'Desmarcar' : 'Selecionar Vídeos'}
              </Button>
              {selectedVideos.length > 0 && (
                <Button
                  onClick={() => setShowClientSelector(true)}
                  className="flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Atribuir para Clientes ({selectedVideos.length})</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {allVideos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum vídeo cadastrado
              </h3>
              <p className="text-gray-500">
                Cadastre vídeos para começar a gerenciar as permissões
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={selectedVideos.includes(video.id)}
                      onCheckedChange={(checked) => handleVideoSelect(video.id, checked as boolean)}
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {video.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      {video.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4">
                        {video.platform && (
                          <Badge variant="secondary">
                            {video.platform}
                          </Badge>
                        )}
                        {video.category && (
                          <Badge variant="outline">
                            {video.category}
                          </Badge>
                        )}
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {video.tags.slice(0, 3).join(', ')}
                              {video.tags.length > 3 && ` +${video.tags.length - 3}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, allVideos.length)} de {allVideos.length} vídeos
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ClientSelectionModal
        open={showClientSelector}
        onOpenChange={setShowClientSelector}
        clients={clients}
        selectedClients={selectedClients}
        onClientToggle={handleClientToggle}
        onBulkClientChange={handleBulkClientChange}
        isLoading={clientsLoading}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        filteredClients={filteredClients}
      />

      {selectedClients.length > 0 && showClientSelector && (
        <div className="fixed bottom-4 right-4">
          <Button onClick={handleAssignToClients} size="lg">
            Confirmar Atribuição ({selectedVideos.length} vídeos → {selectedClients.length} clientes)
          </Button>
        </div>
      )}
    </div>
  );
};
