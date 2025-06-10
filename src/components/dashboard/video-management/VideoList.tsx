
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
  console.log('📋 VideoList - Clientes não deletados:', clients.filter(c => !c.is_deleted).length);
  console.log('📋 VideoList - Permissões de vídeo:', videoPermissions.length);

  const getClientVideoCount = (clientId: string) => {
    const count = videoPermissions.filter(permission => permission.client_id === clientId).length;
    console.log(`📊 VideoList - Cliente ${clientId}: ${count} vídeos`);
    return count;
  };

  // Filtrar clientes não deletados
  const activeClients = clients.filter(client => !client.is_deleted);
  console.log('✅ VideoList - Clientes ativos:', activeClients.length);

  const clientsWithVideos = activeClients.filter(client => {
    const videoCount = getClientVideoCount(client.id);
    return videoCount > 0;
  });

  console.log('🎬 VideoList - Clientes com vídeos:', clientsWithVideos.length);

  // Vamos também verificar se há clientes "perdidos"
  const uniqueClientIds = [...new Set(videoPermissions.map(p => p.client_id))];
  const clientsNotInActiveList = uniqueClientIds.filter(id => 
    !activeClients.some(client => client.id === id)
  );

  if (clientsNotInActiveList.length > 0) {
    console.warn('⚠️ VideoList - Clientes com vídeos mas não na lista ativa:', clientsNotInActiveList);
  }

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
        {clientsNotInActiveList.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Atenção:</strong> Encontramos {clientsNotInActiveList.length} cliente(s) com vídeos que podem estar marcados como deletados. 
              Verifique o console para mais detalhes.
            </p>
          </div>
        )}
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
      
      {/* Alerta para clientes "perdidos" */}
      {clientsNotInActiveList.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Clientes com vídeos não visíveis detectados</h4>
          <p className="text-yellow-700 text-sm">
            Encontramos {clientsNotInActiveList.length} cliente(s) que têm vídeos atribuídos mas não aparecem na listagem. 
            Isso pode indicar que foram marcados como deletados. IDs: {clientsNotInActiveList.join(', ')}
          </p>
        </div>
      )}
      
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
