
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/components/forms/client-selector/ClientSelectorTypes';

export const useClientSelector = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const fetchClients = async () => {
    console.log('=== BUSCANDO CLIENTES NO SELECTOR ===');
    console.log('Usuário atual autenticado:', (await supabase.auth.getUser()).data.user?.id);
    setIsLoading(true);
    try {
      // Primeiro, vamos verificar se conseguimos acessar a tabela profiles
      console.log('Testando acesso à tabela profiles...');
      
      // Buscar TODOS os usuários da tabela profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('full_name');

      console.log('Resposta da query de profiles:');
      console.log('- Data:', data);
      console.log('- Error:', error);
      console.log('- Data length:', data?.length);

      if (error) {
        console.error('Erro na query de clientes:', error);
        console.error('Código do erro:', error.code);
        console.error('Detalhes do erro:', error.details);
        console.error('Hint do erro:', error.hint);
        console.error('Message do erro:', error.message);
        throw error;
      }
      
      console.log('TODOS os perfis encontrados na base:', data);
      console.log('Quantidade total de perfis:', data?.length || 0);
      
      if (data && data.length > 0) {
        data.forEach((profile, index) => {
          console.log(`Perfil ${index + 1}: ID=${profile.id}, Nome="${profile.full_name}", Email="${profile.email}", Role="${profile.role}"`);
        });
      } else {
        console.log('ATENÇÃO: Nenhum perfil foi retornado pela query!');
        
        // Vamos tentar uma query mais simples para debug
        console.log('Tentando query mais simples...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('profiles')
          .select('*');
        
        console.log('Query simples - Data:', simpleData);
        console.log('Query simples - Error:', simpleError);
      }
      
      // Processar os dados para garantir que temos nomes válidos
      const processedClients = (data || []).map(client => {
        const processedName = client.full_name || client.email.split('@')[0] || 'Usuário';
        console.log(`Processando cliente: ${client.email} -> Nome final: "${processedName}"`);
        
        return {
          id: client.id,
          full_name: processedName,
          email: client.email
        };
      });
      
      console.log('Clientes processados para o seletor:', processedClients);
      console.log('Total de clientes disponíveis:', processedClients.length);
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
