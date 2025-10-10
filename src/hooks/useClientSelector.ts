
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/components/forms/client-selector/ClientSelectorTypes';

export const useClientSelector = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const fetchClients = async () => {
    console.log('=== BUSCANDO CLIENTES PARA SELECTOR (OTIMIZADO) ===');
    
    setIsLoading(true);
    try {
      // Query otimizada - apenas campos necessários para o seletor
      const { data: clientsData, error } = await supabase
        .from('profiles')
        .select('id, email, full_name') // Apenas campos necessários
        .eq('role', 'client')
        .eq('is_deleted', false) // Filtrar apenas clientes ativos
        .order('full_name', { ascending: true })
        .limit(100); // Limite para evitar queries muito grandes

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }

      console.log('Clientes otimizados encontrados:', {
        length: clientsData?.length || 0,
        timestamp: Date.now()
      });

      // Processar para o formato do seletor
      const processedClients = (clientsData || []).map(client => ({
        id: client.id,
        full_name: client.full_name || client.email.split('@')[0] || 'Usuário',
        email: client.email
      }));

      setClients(processedClients);
      
    } catch (error) {
      console.error('Erro ao buscar clientes no selector:', error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar clientes baseado no valor de busca - otimizado
  const filteredClients = useMemo(() => {
    if (!searchValue.trim()) {
      return clients;
    }
    
    const searchLower = searchValue.toLowerCase().trim();
    return clients.filter(client => {
      const nameMatch = client.full_name.toLowerCase().includes(searchLower);
      const emailMatch = client.email.toLowerCase().includes(searchLower);
      return nameMatch || emailMatch;
    });
  }, [clients, searchValue]);

  useEffect(() => {
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
