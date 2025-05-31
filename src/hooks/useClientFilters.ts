
import { useState, useEffect } from 'react';
import { Client } from '@/types/client';
import { ClientFilters, ClientCounts } from '@/types/clientManagement';

export const useClientFilters = (clients: Client[]) => {
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'clients' | 'verified' | 'unverified' | 'deleted'>('all');

  useEffect(() => {
    console.log('useClientFilters: Processando clientes:', clients.length);
    console.log('useClientFilters: Tab ativo:', activeTab);
    console.log('useClientFilters: Detalhes completos dos clientes:', clients.map(c => ({
      email: c.email,
      role: c.role,
      email_confirmed_at: c.email_confirmed_at,
      is_deleted: c.is_deleted,
      isVerified: !!c.email_confirmed_at,
      isPending: !c.email_confirmed_at && !c.is_deleted
    })));

    let filtered = clients;

    // Filtrar por status/role
    if (activeTab === 'admins') {
      // Apenas administradores não deletados
      filtered = clients.filter(client => client.role === 'admin' && !client.is_deleted);
      console.log('useClientFilters: Filtrando admins:', filtered.length);
    } else if (activeTab === 'clients') {
      // Apenas clientes não deletados
      filtered = clients.filter(client => client.role === 'client' && !client.is_deleted);
      console.log('useClientFilters: Filtrando clientes:', filtered.length);
    } else if (activeTab === 'verified') {
      // Verificados: têm email_confirmed_at e não estão deletados
      filtered = clients.filter(client => client.email_confirmed_at && !client.is_deleted);
      console.log('useClientFilters: Filtrando verificados:', filtered.length);
      console.log('useClientFilters: Clientes verificados encontrados:', filtered.map(c => ({
        email: c.email,
        email_confirmed_at: c.email_confirmed_at
      })));
    } else if (activeTab === 'unverified') {
      // Pendentes: não têm email_confirmed_at e não estão deletados
      filtered = clients.filter(client => !client.email_confirmed_at && !client.is_deleted);
      console.log('useClientFilters: Filtrando pendentes:', filtered.length);
      console.log('useClientFilters: Clientes pendentes encontrados:', filtered.map(c => ({
        email: c.email,
        email_confirmed_at: c.email_confirmed_at,
        is_deleted: c.is_deleted
      })));
    } else if (activeTab === 'deleted') {
      // Excluídos: estão marcados como deletados
      filtered = clients.filter(client => client.is_deleted);
      console.log('useClientFilters: Filtrando deletados:', filtered.length);
    } else {
      // Todos: apenas os não deletados (admins + clientes)
      filtered = clients.filter(client => !client.is_deleted);
      console.log('useClientFilters: Filtrando todos (não deletados):', filtered.length);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('useClientFilters: Após filtro de busca:', filtered.length);
    }

    console.log('useClientFilters: Resultado final do filtro:', filtered.length);
    console.log('useClientFilters: Clientes finais filtrados:', filtered.map(c => c.email));
    setFilteredClients(filtered);
  }, [searchTerm, clients, activeTab]);

  const getTabCounts = (): ClientCounts => {
    const admins = clients.filter(c => c.role === 'admin' && !c.is_deleted).length;
    const clientsOnly = clients.filter(c => c.role === 'client' && !c.is_deleted).length;
    const verified = clients.filter(c => c.email_confirmed_at && !c.is_deleted).length;
    const unverified = clients.filter(c => !c.email_confirmed_at && !c.is_deleted).length;
    const deleted = clients.filter(c => c.is_deleted).length;
    const all = admins + clientsOnly; // Todos = admins + clientes (sem os deletados)
    
    console.log('useClientFilters: Contagens calculadas:', {
      all, admins, clients: clientsOnly, verified, unverified, deleted
    });
    console.log('useClientFilters: Detalhes dos clientes não verificados:', 
      clients.filter(c => !c.email_confirmed_at && !c.is_deleted).map(c => ({
        email: c.email,
        email_confirmed_at: c.email_confirmed_at
      }))
    );
    
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
