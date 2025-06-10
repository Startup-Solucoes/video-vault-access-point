
import { useMemo, useState } from 'react';
import { Client } from '@/types/client';
import { ClientFilters, ClientCounts } from '@/types/clientManagement';

export const useClientFilters = (clients: Client[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ClientFilters['activeTab']>('all');

  const filteredClients = useMemo(() => {
    console.log('useClientFilters: Filtrando clientes - total:', clients.length);
    console.log('useClientFilters: Filtros ativos:', { activeTab, searchTerm });
    
    let filtered = clients;

    // Filtro por aba ativa - ATUALIZADO para mostrar apenas admins na aba 'clients'
    switch (activeTab) {
      case 'all':
        // Mostrar apenas admins na aba "todos" também, já que clientes estão na seção de vídeos
        filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);
        break;
      case 'admins':
        filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);
        break;
      case 'clients':
        // Mudança: aba 'clients' agora mostra apenas admins
        filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);
        break;
      case 'unverified':
        // Admins não verificados
        filtered = clients.filter(client => !client.email_confirmed_at && client.role === 'admin' && !client.is_deleted);
        break;
      case 'deleted':
        // Admins deletados
        filtered = clients.filter(client => client.is_deleted === true && client.role === 'admin');
        break;
      default:
        filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);
    }

    // Filtro de busca por texto
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(client =>
        client.full_name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower)
      );
    }

    console.log('useClientFilters: Clientes filtrados:', filtered.length);
    return filtered;
  }, [clients, activeTab, searchTerm]);

  const getTabCounts = (): ClientCounts => {
    // Contar apenas admins, já que clientes estão na seção de vídeos
    const counts = {
      all: clients.filter(client => client.role === 'admin' && !client.is_deleted).length,
      admins: clients.filter(client => client.role === 'admin' && !client.is_deleted).length,
      clients: clients.filter(client => client.role === 'admin' && !client.is_deleted).length, // Agora mostra admins
      unverified: clients.filter(client => !client.email_confirmed_at && client.role === 'admin' && !client.is_deleted).length,
      deleted: clients.filter(client => client.is_deleted === true && client.role === 'admin').length
    };
    
    console.log('useClientFilters: Contagens das abas (apenas admins):', counts);
    return counts;
  };

  return {
    filteredClients,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    getTabCounts
  };
};
