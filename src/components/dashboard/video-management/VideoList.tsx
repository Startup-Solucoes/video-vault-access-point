
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

  const getClientVideoCount = (clientId: string) => {
    return videoPermissions.filter(permission => permission.client_id === clientId).length;
  };

  const clientsWithVideos = clients.filter(client => {
    const videoCount = getClientVideoCount(client.id);
    return videoCount > 0;
  });

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
        {clientsWithVideos.map((client) => {
          const videoCount = getClientVideoCount(client.id);
          return (
            <ClientCard
              key={client.id}
              client={client}
              videoCount={videoCount}
              onClientSelect={onClientSelect}
            />
          );
        })}
      </div>
    </div>
  );
};
