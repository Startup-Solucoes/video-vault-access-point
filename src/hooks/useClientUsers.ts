
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CopyPasswordToast } from '@/components/ui/copy-password-toast';
import { 
  fetchClientUsers, 
  addClientUser, 
  removeClientUser,
  ClientUser,
  CreateUserResult
} from '@/services/client/clientUsersService';

export const useClientUsers = (clientId: string | null) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const queryKey = ['client-users', clientId];

  const {
    data: clientUsers = [],
    isLoading,
    error
  } = useQuery({
    queryKey,
    queryFn: () => fetchClientUsers(clientId!),
    enabled: !!clientId,
    staleTime: 3 * 60 * 1000, // 3 minutos - usuários não mudam com frequência
    gcTime: 5 * 60 * 1000, // 5 minutos de cache
    refetchOnMount: false, // Não busca sempre ao montar
    refetchOnWindowFocus: false, // Evita buscas desnecessárias
    retry: 2,
  });

  console.log('🔍 useClientUsers - dados recebidos:', clientUsers);

  const addUserMutation = useMutation({
    mutationFn: ({ userEmail }: { userEmail: string }) =>
      addClientUser(clientId!, userEmail, user!.id),
    onSuccess: (result: CreateUserResult) => {
      console.log('✅ Usuário criado, resultado:', result);
      
      // Atualizar os dados locais para incluir a senha gerada
      queryClient.setQueryData(queryKey, (oldData: ClientUser[] = []) => {
        const newUser: ClientUser = {
          id: result.user.id,
          user_email: result.user.email,
          client_id: clientId!,
          created_at: new Date().toISOString(),
          generated_password: result.password // Adicionar a senha gerada
        };
        
        console.log('🔍 Novo usuário adicionado ao cache:', newUser);
        return [newUser, ...oldData];
      });

      toast({
        title: "Usuário criado com sucesso",
        description: CopyPasswordToast({ 
          email: result.user.email, 
          password: result.password 
        }),
        duration: 15000,
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao adicionar usuário:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar usuário",
        variant: "destructive"
      });
    }
  });

  const removeUserMutation = useMutation({
    mutationFn: ({ clientUserId }: { clientUserId: string }) =>
      removeClientUser(clientUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey,
        exact: true
      });
      toast({
        title: "Sucesso",
        description: "Usuário removido com sucesso",
      });
    },
    onError: (error: Error) => {
      console.error('Erro ao remover usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover usuário",
        variant: "destructive"
      });
    }
  });

  const addUser = (userEmail: string) => {
    if (!clientId || !user) return;
    console.log('🔍 Adicionando usuário:', userEmail);
    addUserMutation.mutate({ userEmail });
  };

  const removeUser = (clientUserId: string) => {
    console.log('🔍 Removendo usuário:', clientUserId);
    removeUserMutation.mutate({ clientUserId });
  };

  return {
    clientUsers,
    isLoading: isLoading || addUserMutation.isPending || removeUserMutation.isPending,
    error,
    addUser,
    removeUser
  };
};
