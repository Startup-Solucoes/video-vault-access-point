
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/components/forms/client-selector/ClientSelectorTypes';

export const useClientSelector = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const fetchClients = async () => {
    console.log('=== BUSCANDO CLIENTES NO SELECTOR ===');
    setIsLoading(true);
    try {
      // Buscar tanto admins quanto clientes
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['client', 'admin'])
        .order('full_name');

      if (error) {
        console.error('Erro na query de clientes:', error);
        throw error;
      }
      
      console.log('Clientes encontrados na base (incluindo admins):', data);
      console.log('Quantidade total:', data?.length || 0);
      
      // Processar os dados para garantir que temos nomes válidos
      const processedClients = (data || []).map(client => ({
        id: client.id,
        full_name: client.full_name || client.email.split('@')[0] || 'Usuário',
        email: client.email
      }));
      
      console.log('Clientes processados:', processedClients);
      setClients(processedClients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar clientes baseado no valor de busca
  const filteredClients = useMemo(() => {
    console.log('=== FILTRANDO CLIENTES ===');
    console.log('Termo de busca:', searchValue);
    console.log('Total de clientes antes do filtro:', clients.length);
    
    if (!searchValue.trim()) {
      console.log('Sem termo de busca, retornando todos os clientes');
      return clients;
    }
    
    const searchLower = searchValue.toLowerCase().trim();
    const filtered = clients.filter(client => {
      const nameMatch = client.full_name.toLowerCase().includes(searchLower);
      const emailMatch = client.email.toLowerCase().includes(searchLower);
      return nameMatch || emailMatch;
    });
    
    console.log('Clientes após filtro:', filtered.length);
    console.log('Clientes filtrados:', filtered.map(c => c.full_name));
    return filtered;
  }, [clients, searchValue]);

  useEffect(() => {
    console.log('=== COMPONENTE MONTADO - BUSCANDO CLIENTES ===');
    fetchClients();
  }, []);

  return {
    clients,
    filteredClients,
    isLoading,
    searchValue,
    setSearchValue,
    fetchClients
  };
};
