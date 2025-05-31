
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/components/forms/client-selector/ClientSelectorTypes';

export const useClientSelector = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const fetchClients = async () => {
    console.log('=== INICIANDO BUSCA DE CLIENTES NO SELECTOR (SEM CACHE) ===');
    
    setIsLoading(true);
    try {
      // Verificar usuário atual
      const { data: user } = await supabase.auth.getUser();
      console.log('Usuário autenticado:', {
        id: user.user?.id,
        email: user.user?.email,
        role: user.user?.user_metadata?.role
      });

      // Buscar dados frescos sempre, sem cache - incluindo timestamp para forçar refresh
      const timestamp = Date.now();
      console.log('Timestamp da busca:', timestamp);
      
      const { data: clientsData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name
        `)
        .eq('role', 'client')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        throw error;
      }

      console.log('Dados retornados diretamente do Supabase:', {
        timestamp,
        length: clientsData?.length || 0,
        clients: clientsData
      });

      // Processar para o formato do seletor
      const processedClients = (clientsData || []).map(client => ({
        id: client.id,
        full_name: client.full_name || client.email.split('@')[0] || 'Usuário',
        email: client.email
      }));

      console.log('Clientes processados para o seletor:', processedClients);
      setClients(processedClients);
      
    } catch (error) {
      console.error('Erro ao buscar clientes no selector:', error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar clientes baseado no valor de busca
  const filteredClients = useMemo(() => {
    console.log('=== FILTRANDO CLIENTES ===');
    console.log('Termo de busca atual:', `"${searchValue}"`);
    console.log('Total de clientes antes do filtro:', clients.length);
    console.log('Lista completa de clientes:', clients.map(c => `${c.full_name} (${c.email})`));
    
    if (!searchValue.trim()) {
      console.log('Sem termo de busca, retornando todos os clientes');
      return clients;
    }
    
    const searchLower = searchValue.toLowerCase().trim();
    console.log('Termo de busca normalizado:', `"${searchLower}"`);
    
    const filtered = clients.filter(client => {
      const nameMatch = client.full_name.toLowerCase().includes(searchLower);
      const emailMatch = client.email.toLowerCase().includes(searchLower);
      const match = nameMatch || emailMatch;
      console.log(`Cliente ${client.full_name}: nameMatch=${nameMatch}, emailMatch=${emailMatch}, match=${match}`);
      return match;
    });
    
    console.log('Clientes após filtro:', filtered.length);
    console.log('Clientes filtrados:', filtered.map(c => `${c.full_name} (${c.email})`));
    return filtered;
  }, [clients, searchValue]);

  // Remover qualquer dependência de cache - sempre busca na montagem
  useEffect(() => {
    console.log('=== COMPONENTE SELECTOR MONTADO - REMOVENDO CACHE ===');
    fetchClients();
  }, []); // Sem dependências para garantir execução única

  return {
    clients,
    filteredClients,
    isLoading,
    searchValue,
    setSearchValue,
    fetchClients
  };
};
