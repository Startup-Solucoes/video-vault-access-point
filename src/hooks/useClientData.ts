
import { useState, useEffect } from 'react';
import { Client, EditClientForm } from '@/types/client';
import { toast } from '@/hooks/use-toast';
import { 
  fetchClientsFromDB, 
  updateClientInDB, 
  approveClientInDB, 
  deleteClientFromDB 
} from '@/services/clientService';

export const useClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      console.log('useClientData: Iniciando busca de clientes...');
      setIsLoading(true);
      const data = await fetchClientsFromDB();
      console.log('useClientData: Clientes carregados:', data.length);
      console.log('useClientData: Dados dos clientes:', data);
      setClients(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (clientId: string, editForm: EditClientForm) => {
    try {
      console.log('useClientData: Atualizando cliente:', clientId);
      await updateClientInDB(clientId, editForm);
      await fetchClients(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente",
        variant: "destructive"
      });
    }
  };

  const approveClient = async (clientId: string, clientEmail: string) => {
    try {
      console.log('useClientData: Aprovando cliente:', clientId);
      await approveClientInDB(clientId, clientEmail);
      await fetchClients(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao aprovar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar cliente",
        variant: "destructive"
      });
    }
  };

  const deleteClient = async (clientId: string, clientName: string) => {
    try {
      console.log('useClientData: Removendo cliente:', clientId);
      await deleteClientFromDB(clientId, clientName);
      await fetchClients(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive"
      });
    }
  };

  // Buscar clientes na inicialização
  useEffect(() => {
    console.log('useClientData: Componente montado, buscando clientes...');
    fetchClients();
  }, []);

  // Polling para verificar novos clientes a cada 5 segundos quando não está carregando
  useEffect(() => {
    if (!isLoading) {
      console.log('useClientData: Configurando polling para verificar novos clientes...');
      const interval = setInterval(() => {
        console.log('useClientData: Verificando novos clientes (polling)...');
        fetchClients();
      }, 5000);

      return () => {
        console.log('useClientData: Limpando polling...');
        clearInterval(interval);
      };
    }
  }, [isLoading]);

  return {
    clients,
    isLoading,
    fetchClients,
    updateClient,
    approveClient,
    deleteClient
  };
};
