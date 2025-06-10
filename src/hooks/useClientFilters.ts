
import { useMemo, useState } from 'react';
import { Client } from '@/types/client';

export const useClientFilters = (clients: Client[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = useMemo(() => {
    console.log('useClientFilters: Filtrando clientes - total:', clients.length);
    console.log('useClientFilters: Filtros ativos:', { searchTerm });
    
    // Mostrar apenas admins não deletados
    let filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);

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
  }, [clients, searchTerm]);

  return {
    filteredClients,
    searchTerm,
    setSearchTerm
  };
};
