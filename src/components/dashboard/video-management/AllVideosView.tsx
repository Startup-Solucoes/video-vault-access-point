
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useClientData } from '@/hooks/useClientData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Tag, Users } from 'lucide-react';
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
  const { clients } = useClientData();
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [showClientSelector, setShowClientSelector] = useState(false);

  const { data: videos = [], isLoading } = useQuery({
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

  const handleAssignToClients = async (selectedClientIds: string[]) => {
    try {
      const permissions = selectedVideos.flatMap(videoId =>
        selectedClientIds.map(clientId => ({
          video_id: videoId,
          client_id: clientId,
          granted_by: supabase.auth.getUser().then(u => u.data.user?.id)
        }))
      );

      const { error } = await supabase
        .from('video_permissions')
        .insert(permissions);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) atribuído(s) para ${selectedClientIds.length} cliente(s)`,
      });

      setSelectedVideos([]);
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
              <span>Todos os Vídeos ({videos.length})</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleSelectAll}
              >
                {selectedVideos.length === videos.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
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
          {videos.length === 0 ? (
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
          )}
        </CardContent>
      </Card>

      <ClientSelectionModal
        open={showClientSelector}
        onOpenChange={setShowClientSelector}
        clients={clients}
        onClientsSelected={handleAssignToClients}
        title="Selecionar Clientes"
        description={`Selecione os clientes que receberão acesso aos ${selectedVideos.length} vídeo(s) selecionado(s)`}
      />
    </div>
  );
};
