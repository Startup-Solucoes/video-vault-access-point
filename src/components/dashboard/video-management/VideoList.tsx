
import React from 'react';
import { useClientData } from '@/hooks/useClientData';
import { useVideoPermissions } from '@/hooks/useVideoPermissions';
import { ClientCard } from './ClientCard';
import { Video } from 'lucide-react';

interface VideoListProps {
  onClientSelect: (clientId: string, clientName: string, clientLogoUrl?: string) => void;
}

export const VideoList = ({ onClientSelect }: VideoListProps) => {
  const { clients, isLoading } = useClientData();
  const { videoPermissions, isLoadingPermissions } = useVideoPermissions();

  console.log('📋 VideoList - Todos os clientes:', clients.length);
  console.log('📋 VideoList - Permissões de vídeo:', videoPermissions.length);

  const getClientVideoCount = (clientId: string) => {
    const count = videoPermissions.filter(permission => permission.client_id === clientId).length;
    console.log(`📊 VideoList - Cliente ${clientId}: ${count} vídeos`);
    return count;
  };

  // Mostrar TODOS os clientes (incluindo os sem vídeos)
  const getAllClientsWithVideoCount = () => {
    // Filtrar apenas clientes não deletados
    const activeClients = clients.filter(client => !client.is_deleted);
    
    console.log('✅ Clientes ativos encontrados:', activeClients.length);
    
    // Mapear todos os clientes com suas respectivas contagens de vídeo
    const clientsWithVideos = activeClients.map(client => {
      const videoCount = getClientVideoCount(client.id);
      return { client, videoCount };
    });

    // Ordenar por quantidade de vídeos (maior para menor) e depois por nome
    clientsWithVideos.sort((a, b) => {
      if (a.videoCount !== b.videoCount) {
        return b.videoCount - a.videoCount; // Maior quantidade primeiro
      }
      return a.client.full_name.localeCompare(b.client.full_name); // Alfabético
    });

    console.log('✅ Todos os clientes com contagem:', clientsWithVideos.length);
    return clientsWithVideos;
  };

  if (isLoading || isLoadingPermissions) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando clientes...</span>
        </div>
      </div>
    );
  }

  const allClientsWithVideoCount = getAllClientsWithVideoCount();

  if (allClientsWithVideoCount.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum cliente encontrado
        </h3>
        <p className="text-gray-500">
          Cadastre clientes para começar a gerenciar vídeos
        </p>
      </div>
    );
  }

  // Separar clientes com e sem vídeos para estatísticas
  const clientsWithVideos = allClientsWithVideoCount.filter(({ videoCount }) => videoCount > 0);
  const clientsWithoutVideos = allClientsWithVideoCount.filter(({ videoCount }) => videoCount === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Todos os Clientes ({allClientsWithVideoCount.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {clientsWithVideos.length} com vídeos • {clientsWithoutVideos.length} sem vídeos
          </p>
        </div>
      </div>
      
      {/* Grid responsivo de cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {allClientsWithVideoCount.map(({ client, videoCount }) => (
          <ClientCard
            key={client.id}
            client={client}
            videoCount={videoCount}
            onClientSelect={onClientSelect}
          />
        ))}
      </div>
    </div>
  );
};
