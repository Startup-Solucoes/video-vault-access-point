
import React, { useState, useMemo } from 'react';
import { useClientData } from '@/hooks/useClientData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientCard } from './ClientCard';
import { SearchBar } from './SearchBar';
import { Video, Search, ArrowUpDown, Users, Calendar, Hash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface VideoListProps {
  onClientSelect: (clientId: string, clientName: string, clientLogoUrl?: string) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'videos-asc' | 'videos-desc' | 'date-asc' | 'date-desc';

export const VideoList = ({ onClientSelect }: VideoListProps) => {
  const { clients, isLoading } = useClientData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('videos-desc');

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

    // Aplicar ordenação baseada na opção selecionada
    clientsWithVideos.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.client.full_name.localeCompare(b.client.full_name);
        case 'name-desc':
          return b.client.full_name.localeCompare(a.client.full_name);
        case 'videos-asc':
          return a.videoCount - b.videoCount;
        case 'videos-desc':
          return b.videoCount - a.videoCount;
        case 'date-asc':
          return new Date(a.client.created_at || 0).getTime() - new Date(b.client.created_at || 0).getTime();
        case 'date-desc':
          return new Date(b.client.created_at || 0).getTime() - new Date(a.client.created_at || 0).getTime();
        default:
          return b.videoCount - a.videoCount; // Fallback para videos-desc
      }
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
  }, [clients, videoCountsByClient, searchTerm, sortBy]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Clientes ({filteredClients.length})
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {clientsWithVideos.length} com vídeos • {clientsWithoutVideos.length} sem vídeos
          </p>
        </div>
        
        {/* Opções de Ordenação */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="videos-desc">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Mais vídeos primeiro
                </div>
              </SelectItem>
              <SelectItem value="videos-asc">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Menos vídeos primeiro
                </div>
              </SelectItem>
              <SelectItem value="name-asc">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Nome A-Z
                </div>
              </SelectItem>
              <SelectItem value="name-desc">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Nome Z-A
                </div>
              </SelectItem>
              <SelectItem value="date-desc">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Mais recentes
                </div>
              </SelectItem>
              <SelectItem value="date-asc">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Mais antigos
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
