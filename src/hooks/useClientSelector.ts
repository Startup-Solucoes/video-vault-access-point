
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/components/forms/client-selector/ClientSelectorTypes';

export const useClientSelector = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const fetchClients = async () => {
    console.log('=== BUSCANDO CLIENTES NO SELECTOR ===');
    const { data: user } = await supabase.auth.getUser();
    console.log('Usuário atual autenticado:', user.user?.id);
    console.log('Role do usuário atual:', user.user?.user_metadata?.role);
    
    setIsLoading(true);
    try {
      console.log('Testando acesso à tabela profiles...');
      
      // Tentar buscar todos os perfis primeiro
      console.log('Tentativa 1: Buscar todos os perfis...');
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .order('full_name');

      console.log('Resultado da busca de todos os perfis:');
      console.log('- Data:', allProfiles);
      console.log('- Error:', allError);
      console.log('- Quantidade:', allProfiles?.length || 0);

      if (allError) {
        console.error('Erro ao buscar todos os perfis:', allError);
        
        // Se deu erro, tentar buscar apenas clientes
        console.log('Tentativa 2: Buscar apenas clientes...');
        const { data: clientsOnly, error: clientError } = await supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .eq('role', 'client')
          .order('full_name');

        console.log('Resultado da busca apenas de clientes:');
        console.log('- Data:', clientsOnly);
        console.log('- Error:', clientError);
        
        if (clientError) {
          console.error('Erro ao buscar clientes:', clientError);
          
          // Última tentativa: buscar sem filtros
          console.log('Tentativa 3: Buscar sem filtros...');
          const { data: noFilter, error: noFilterError } = await supabase
            .from('profiles')
            .select('*');

          console.log('Resultado sem filtros:');
          console.log('- Data:', noFilter);
          console.log('- Error:', noFilterError);
          
          if (noFilterError) {
            throw noFilterError;
          }
          
          // Usar dados sem filtro se disponível
          if (noFilter && noFilter.length > 0) {
            const processedClients = noFilter.map(client => ({
              id: client.id,
              full_name: client.full_name || client.email.split('@')[0] || 'Usuário',
              email: client.email
            }));
            
            console.log('Clientes processados (sem filtro):', processedClients);
            setClients(processedClients);
            return;
          }
        } else if (clientsOnly) {
          // Usar apenas clientes se conseguiu buscar
          const processedClients = clientsOnly.map(client => ({
            id: client.id,
            full_name: client.full_name || client.email.split('@')[0] || 'Usuário',
            email: client.email
          }));
          
          console.log('Clientes processados (apenas clientes):', processedClients);
          setClients(processedClients);
          return;
        }
      } else {
        // Sucesso na busca de todos os perfis
        console.log('TODOS os perfis encontrados na base:', allProfiles);
        console.log('Quantidade total de perfis:', allProfiles?.length || 0);
        
        if (allProfiles && allProfiles.length > 0) {
          allProfiles.forEach((profile, index) => {
            console.log(`Perfil ${index + 1}: ID=${profile.id}, Nome="${profile.full_name}", Email="${profile.email}", Role="${profile.role}"`);
          });
          
          // Processar os dados para garantir que temos nomes válidos
          const processedClients = allProfiles.map(client => {
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
          return;
        } else {
          console.log('ATENÇÃO: Nenhum perfil foi retornado pela query de todos os perfis!');
        }
      }
      
      // Se chegou até aqui, não conseguiu buscar nenhum cliente
      console.log('Nenhum cliente encontrado em nenhuma tentativa');
      setClients([]);
      
    } catch (error) {
      console.error('Erro geral ao buscar clientes:', error);
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
