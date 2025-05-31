
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

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    isLoading,
    fetchClients,
    updateClient,
    approveClient,
    deleteClient
  };
};
