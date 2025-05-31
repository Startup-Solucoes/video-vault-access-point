
import { useState, useEffect } from 'react';
import { Client } from '@/types/client';
import { ClientFilters, ClientCounts } from '@/types/clientManagement';

export const useClientFilters = (clients: Client[]) => {
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'clients' | 'verified' | 'unverified' | 'deleted'>('all');

  useEffect(() => {
    let filtered = clients;

    // Filtrar por status/role
    if (activeTab === 'admins') {
      // Apenas administradores não deletados
      filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);
    } else if (activeTab === 'clients') {
      // Apenas clientes não deletados
      filtered = clients.filter(client => client.role === 'client' && !client.is_deleted);
    } else if (activeTab === 'verified') {
      // Verificados: têm email_confirmed_at e não estão deletados
      filtered = clients.filter(client => client.email_confirmed_at && !client.is_deleted);
    } else if (activeTab === 'unverified') {
      // Pendentes: não têm email_confirmed_at e não estão deletados
      filtered = clients.filter(client => !client.email_confirmed_at && !client.is_deleted);
    } else if (activeTab === 'deleted') {
      // Excluídos: estão marcados como deletados
      filtered = clients.filter(client => client.is_deleted);
    } else {
      // Todos: apenas os não deletados (admins + clientes)
      filtered = clients.filter(client => !client.is_deleted);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    console.log(`Filtro ${activeTab}: ${filtered.length} usuários encontrados`);
    setFilteredClients(filtered);
  }, [searchTerm, clients, activeTab]);

  const getTabCounts = (): ClientCounts => {
    const admins = clients.filter(c => c.role === 'admin' && !c.is_deleted).length;
    const clientsOnly = clients.filter(c => c.role === 'client' && !c.is_deleted).length;
    const verified = clients.filter(c => c.email_confirmed_at && !c.is_deleted).length;
    const unverified = clients.filter(c => !c.email_confirmed_at && !c.is_deleted).length;
    const deleted = clients.filter(c => c.is_deleted).length;
    const all = admins + clientsOnly; // Todos = admins + clientes (sem os deletados)
    
    console.log('Contadores:', { all, admins, clients: clientsOnly, verified, unverified, deleted });
    return { all, admins, clients: clientsOnly, verified, unverified, deleted };
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
