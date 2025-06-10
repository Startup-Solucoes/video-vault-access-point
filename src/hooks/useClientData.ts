
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

  // Query para buscar clientes - INCLUINDO DELETADOS para análise completa
  const {
    data: clients = [],
    isLoading,
    error
  } = useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: fetchClientsFromDB,
    staleTime: 5 * 60 * 1000, // 5 minutos - dados frescos por mais tempo
    gcTime: 10 * 60 * 1000, // 10 minutos - mantém cache por mais tempo
    refetchOnMount: false, // Não busca sempre ao montar se dados estão frescos
    refetchOnWindowFocus: false, // Evita buscas ao voltar para aba
    refetchOnReconnect: true, // Mantém busca ao reconectar (importante)
    retry: 2, // Retry em caso de erro
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Backoff exponencial
  });

  // Mutation para atualizar cliente
  const updateClientMutation = useMutation({
    mutationFn: ({ clientId, editForm }: { clientId: string; editForm: EditClientForm }) =>
      updateClientInDB(clientId, editForm),
    onSuccess: () => {
      // Invalidação mais específica e eficiente
      queryClient.invalidateQueries({ 
        queryKey: CLIENTS_QUERY_KEY,
        exact: true // Só invalida esta query específica
      });
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
      queryClient.invalidateQueries({ 
        queryKey: CLIENTS_QUERY_KEY,
        exact: true
      });
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
      queryClient.invalidateQueries({ 
        queryKey: CLIENTS_QUERY_KEY,
        exact: true
      });
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

  // Função para forçar atualização manual - OTIMIZADA
  const refreshClients = () => {
    console.log('useClientData: refreshClients chamado - invalidando queries de forma otimizada');
    queryClient.invalidateQueries({ 
      queryKey: CLIENTS_QUERY_KEY,
      exact: true,
      refetchType: 'active' // Só refetch se a query estiver ativa
    });
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

  // Log para debug
  console.log('useClientData: Total de clientes carregados:', clients.length);
  console.log('useClientData: Clientes deletados:', clients.filter(c => c.is_deleted).length);
  console.log('useClientData: Clientes ativos:', clients.filter(c => !c.is_deleted).length);

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
