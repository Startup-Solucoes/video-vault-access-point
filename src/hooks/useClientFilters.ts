
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

    // Filtro por aba ativa
    switch (activeTab) {
      case 'all':
        filtered = clients.filter(client => !client.is_deleted);
        break;
      case 'admins':
        filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);
        break;
      case 'clients':
        filtered = clients.filter(client => client.role === 'client' && !client.is_deleted);
        break;
      case 'verified':
        filtered = clients.filter(client => client.email_confirmed_at && !client.is_deleted);
        break;
      case 'unverified':
        filtered = clients.filter(client => !client.email_confirmed_at && !client.is_deleted);
        break;
      case 'deleted':
        filtered = clients.filter(client => client.is_deleted === true);
        break;
      default:
        filtered = clients.filter(client => !client.is_deleted);
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
    const counts = {
      all: clients.filter(client => !client.is_deleted).length,
      admins: clients.filter(client => client.role === 'admin' && !client.is_deleted).length,
      clients: clients.filter(client => client.role === 'client' && !client.is_deleted).length,
      verified: clients.filter(client => client.email_confirmed_at && !client.is_deleted).length,
      unverified: clients.filter(client => !client.email_confirmed_at && !client.is_deleted).length,
      deleted: clients.filter(client => client.is_deleted === true).length
    };
    
    console.log('useClientFilters: Contagens das abas:', counts);
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
