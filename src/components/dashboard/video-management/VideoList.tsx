
import React, { useState, useMemo } from 'react';
import { useClientData } from '@/hooks/useClientData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientCard } from './ClientCard';
import { SearchBar } from './SearchBar';
import { Video, Search } from 'lucide-react';

interface VideoListProps {
  onClientSelect: (clientId: string, clientName: string, clientLogoUrl?: string) => void;
}

export const VideoList = ({ onClientSelect }: VideoListProps) => {
  const { clients, isLoading } = useClientData();
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar contagem de vídeos por cliente diretamente da tabela video_permissions
  const { data: videoCountsByClient = {}, isLoading: isLoadingVideoCounts } = useQuery({
    queryKey: ['video-counts-by-client'],
    queryFn: async () => {
      console.log('📊 VideoList - Buscando contagem de vídeos por cliente...');
      
      const { data, error } = await supabase
        .from('video_permissions')
        .select('client_id')
        .order('client_id');

      if (error) {
        console.error('❌ Erro ao buscar contagem de vídeos:', error);
        throw error;
      }

      // Contar vídeos por cliente
      const counts: Record<string, number> = {};
      data?.forEach(permission => {
        counts[permission.client_id] = (counts[permission.client_id] || 0) + 1;
      });

      console.log('✅ VideoList - Contagem de vídeos por cliente:', counts);
      return counts;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000 // 5 minutos
  });

  console.log('📋 VideoList - Todos os clientes:', clients.length);
  console.log('📋 VideoList - Contagens carregadas:', Object.keys(videoCountsByClient).length);

  const getClientVideoCount = (clientId: string) => {
    const count = videoCountsByClient[clientId] || 0;
    console.log(`📊 VideoList - Cliente ${clientId}: ${count} vídeos`);
    return count;
  };

  // Mostrar APENAS clientes (role = 'client') - não incluir admins
  const getClientsWithVideoCount = () => {
    // Filtrar apenas clientes não deletados e com role 'client'
    const activeClients = clients.filter(client => !client.is_deleted && client.role === 'client');
    
    console.log('✅ Clientes (role=client) encontrados:', activeClients.length);
    
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

    console.log('✅ Clientes (role=client) com contagem:', clientsWithVideos.length);
    return clientsWithVideos;
  };

  // Filtrar clientes com base no termo de busca
  const filteredClients = useMemo(() => {
    const allClients = getClientsWithVideoCount();
    
    if (!searchTerm.trim()) {
      return allClients;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return allClients.filter(({ client }) =>
      client.full_name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower)
    );
  }, [clients, videoCountsByClient, searchTerm]);

  if (isLoading || isLoadingVideoCounts) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando clientes...</span>
        </div>
      </div>
    );
  }

  const allClientsWithVideoCount = getClientsWithVideoCount();

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
  const clientsWithVideos = filteredClients.filter(({ videoCount }) => videoCount > 0);
  const clientsWithoutVideos = filteredClients.filter(({ videoCount }) => videoCount === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Clientes ({filteredClients.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {clientsWithVideos.length} com vídeos • {clientsWithoutVideos.length} sem vídeos
          </p>
        </div>
      </div>

      {/* Barra de Busca */}
      <SearchBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Buscar cliente por nome ou email..."
        className="max-w-md"
      />

      {filteredClients.length === 0 && searchTerm ? (
        <div className="text-center py-8">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar o termo de busca
          </p>
        </div>
      ) : (
        /* Grid responsivo de cards */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredClients.map(({ client, videoCount }) => (
            <ClientCard
              key={client.id}
              client={client}
              videoCount={videoCount}
              onClientSelect={onClientSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
