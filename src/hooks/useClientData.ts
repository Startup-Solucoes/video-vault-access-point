
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Client, EditClientForm } from '@/types/client';
import { toast } from '@/hooks/use-toast';
import { 
  fetchClientsFromDB, 
  updateClientInDB, 
  approveClientInDB, 
  deleteClientFromDB 
} from '@/services/clientService';

const CLIENTS_QUERY_KEY = ['clients'];

export const useClientData = () => {
  const queryClient = useQueryClient();

  // Query para buscar clientes sem cache
  const {
    data: clients = [],
    isLoading,
    error
  } = useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: fetchClientsFromDB,
    staleTime: 0, // Dados sempre considerados obsoletos
    gcTime: 0, // Não mantém cache
    refetchOnMount: true, // Sempre busca ao montar
    refetchOnWindowFocus: true, // Busca quando volta para a aba
  });

  // Mutation para atualizar cliente
  const updateClientMutation = useMutation({
    mutationFn: ({ clientId, editForm }: { clientId: string; editForm: EditClientForm }) =>
      updateClientInDB(clientId, editForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente",
        variant: "destructive"
      });
    }
  });

  // Mutation para aprovar cliente
  const approveClientMutation = useMutation({
    mutationFn: ({ clientId, clientEmail }: { clientId: string; clientEmail: string }) =>
      approveClientInDB(clientId, clientEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast({
        title: "Sucesso",
        description: "Cliente aprovado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao aprovar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar cliente",
        variant: "destructive"
      });
    }
  });

  // Mutation para deletar cliente
  const deleteClientMutation = useMutation({
    mutationFn: ({ clientId, clientName }: { clientId: string; clientName: string }) =>
      deleteClientFromDB(clientId, clientName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast({
        title: "Sucesso",
        description: "Cliente removido com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive"
      });
    }
  });

  // Função para forçar atualização manual
  const refreshClients = () => {
    queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
  };

  const updateClient = (clientId: string, editForm: EditClientForm) => {
    updateClientMutation.mutate({ clientId, editForm });
  };

  const approveClient = (clientId: string, clientEmail: string) => {
    approveClientMutation.mutate({ clientId, clientEmail });
  };

  const deleteClient = (clientId: string, clientName: string) => {
    deleteClientMutation.mutate({ clientId, clientName });
  };

  return {
    clients,
    isLoading: isLoading || updateClientMutation.isPending || approveClientMutation.isPending || deleteClientMutation.isPending,
    error,
    refreshClients,
    updateClient,
    approveClient,
    deleteClient
  };
};
