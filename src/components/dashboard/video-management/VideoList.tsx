
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

  // Criar uma lista completa de clientes que têm vídeos
  const getClientsWithVideos = () => {
    // Primeiro, pegar todos os IDs únicos de clientes que têm permissões de vídeo
    const clientIdsWithVideos = [...new Set(videoPermissions.map(p => p.client_id))];
    console.log('🎯 IDs de clientes com vídeos nas permissões:', clientIdsWithVideos);

    // Mapear para objetos de cliente, usando dados da lista de clientes ou dados das permissões
    const clientsWithVideos = clientIdsWithVideos.map(clientId => {
      // Tentar encontrar o cliente na lista principal
      let client = clients.find(c => c.id === clientId);
      
      if (!client) {
        // Se não encontrar na lista principal, tentar pegar dos dados das permissões
        const permission = videoPermissions.find(p => p.client_id === clientId && p.client);
        if (permission?.client) {
          console.log('⚠️ Cliente encontrado nas permissões mas não na lista principal:', permission.client);
          client = {
            id: permission.client.id,
            full_name: permission.client.full_name,
            email: permission.client.email,
            logo_url: undefined,
            role: 'client',
            created_at: '',
            updated_at: '',
            is_deleted: false
          };
        }
      }

      if (client) {
        const videoCount = getClientVideoCount(clientId);
        return { client, videoCount };
      }
      
      console.warn('❌ Cliente não encontrado:', clientId);
      return null;
    }).filter(Boolean);

    console.log('✅ Clientes com vídeos finalizados:', clientsWithVideos.length);
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

  const clientsWithVideos = getClientsWithVideos();

  if (clientsWithVideos.length === 0) {
    return (
      <div className="text-center py-12">
        <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum cliente com vídeos
        </h3>
        <p className="text-gray-500">
          Adicione permissões de vídeos para seus clientes para começar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Clientes com Vídeos ({clientsWithVideos.length})
        </h3>
      </div>
      
      {/* Grid responsivo de cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {clientsWithVideos.map(({ client, videoCount }) => (
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
