
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useClientData } from '@/hooks/useClientData';
import { useVideoCountsCache } from '@/hooks/useVideoCountsCache';
import { ClientCard } from './ClientCard';
import { SearchBar } from './SearchBar';
import { Video, Search, ArrowUpDown, Users, Calendar, Hash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VideoListProps {
  onClientSelect: (clientId: string, clientName: string, clientLogoUrl?: string) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'videos-asc' | 'videos-desc' | 'date-asc' | 'date-desc';

const STORAGE_KEY = 'videolist-state';

const getSavedState = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Erro ao recuperar estado:', e);
  }
  return { sortBy: 'name-asc', searchTerm: '', scrollPosition: 0 };
};

const saveState = (sortBy: SortOption, searchTerm: string, scrollPosition: number) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ sortBy, searchTerm, scrollPosition }));
  } catch (e) {
    console.error('Erro ao salvar estado:', e);
  }
};

export const VideoList = ({ onClientSelect }: VideoListProps) => {
  const { clients, isLoading } = useClientData();
  const savedState = getSavedState();
  const [searchTerm, setSearchTerm] = useState(savedState.searchTerm || '');
  const [sortBy, setSortBy] = useState<SortOption>(savedState.sortBy || 'name-asc');
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRestoredScroll = useRef(false);

  // Salvar estado quando mudar
  useEffect(() => {
    const scrollPosition = window.scrollY;
    saveState(sortBy, searchTerm, scrollPosition);
  }, [sortBy, searchTerm]);

  // Salvar posição do scroll periodicamente
  useEffect(() => {
    const handleScroll = () => {
      saveState(sortBy, searchTerm, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sortBy, searchTerm]);

  // Restaurar posição do scroll após carregar
  useEffect(() => {
    if (!isLoading && !hasRestoredScroll.current && savedState.scrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo(0, savedState.scrollPosition);
        hasRestoredScroll.current = true;
      }, 100);
    }
  }, [isLoading]);

  // Usar hook com cache e realtime para contagem de vídeos
  const { videoCountsByClient, isLoading: isLoadingVideoCounts, getClientVideoCount } = useVideoCountsCache();

  // Handler para selecionar cliente salvando a posição do scroll
  const handleClientSelect = (clientId: string, clientName: string, clientLogoUrl?: string) => {
    saveState(sortBy, searchTerm, window.scrollY);
    onClientSelect(clientId, clientName, clientLogoUrl);
  };

  // Debug logs
  const countsLoaded = Object.keys(videoCountsByClient).length;
  console.log('📋 VideoList - Clientes:', clients.length, '| Contagens:', countsLoaded, '| Loading:', isLoadingVideoCounts);

  // Mostrar APENAS clientes (role = 'client') - não incluir admins
  const getClientsWithVideoCount = useCallback(() => {
    // Filtrar apenas clientes não deletados e com role 'client'
    const activeClients = clients.filter(client => !client.is_deleted && client.role === 'client');
    
    // Mapear todos os clientes com suas respectivas contagens de vídeo
    const clientsWithVideos = activeClients.map(client => {
      const videoCount = videoCountsByClient[client.id] || 0;
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
          return b.videoCount - a.videoCount;
      }
    });

    return clientsWithVideos;
  }, [clients, videoCountsByClient, sortBy]);

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
  }, [getClientsWithVideoCount, searchTerm]);

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
      {/* Cabeçalho com estatísticas e controles */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900">
              Clientes ({filteredClients.length})
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{clientsWithVideos.length} com vídeos</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span>{clientsWithoutVideos.length} sem vídeos</span>
              </div>
            </div>
          </div>
          
          {/* Controles de busca e ordenação */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Barra de Busca */}
            <SearchBar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Buscar cliente..."
              className="w-full sm:w-64"
            />
            
            {/* Seletor de Ordenação */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <ArrowUpDown className="h-4 w-4" />
                <span className="whitespace-nowrap">Ordenar:</span>
              </div>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48 bg-white">
                  <SelectValue placeholder="Escolher ordenação..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="videos-desc">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      <span>Mais vídeos primeiro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="videos-asc">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      <span>Menos vídeos primeiro</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="name-asc">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Nome A-Z</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="name-desc">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>Nome Z-A</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="date-desc">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>Mais recentes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="date-asc">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-500" />
                      <span>Mais antigos</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {filteredClients.length === 0 && searchTerm ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum cliente encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar o termo de busca ou filtros
          </p>
        </div>
      ) : (
        /* Grid responsivo de cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(({ client, videoCount }) => (
            <ClientCard
              key={client.id}
              client={client}
              videoCount={videoCount}
              onClientSelect={handleClientSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
