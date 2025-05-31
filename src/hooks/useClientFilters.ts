
import { useState, useEffect } from 'react';
import { Client } from '@/types/client';
import { ClientFilters, ClientCounts } from '@/types/clientManagement';

export const useClientFilters = (clients: Client[]) => {
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    let filtered = clients;

    // Filtrar por status
    if (activeTab === 'verified') {
      filtered = clients.filter(client => client.email_confirmed_at);
    } else if (activeTab === 'unverified') {
      filtered = clients.filter(client => !client.email_confirmed_at);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  }, [searchTerm, clients, activeTab]);

  const getTabCounts = (): ClientCounts => {
    const verified = clients.filter(c => c.email_confirmed_at).length;
    const unverified = clients.filter(c => !c.email_confirmed_at).length;
    return { all: clients.length, verified, unverified };
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
