
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
    staleTime: 30000,
  });

  const addUserMutation = useMutation({
    mutationFn: ({ userEmail }: { userEmail: string }) =>
      addClientUser(clientId!, userEmail, user!.id),
    onSuccess: (result: CreateUserResult) => {
      queryClient.invalidateQueries({ queryKey });

      toast({
        title: "Usuário criado com sucesso",
        description: CopyPasswordToast({ 
          email: result.user.email, 
          password: result.password 
        }),
        duration: 15000, // Show for longer so they can copy the password
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
      queryClient.invalidateQueries({ queryKey });
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
    addUserMutation.mutate({ userEmail });
  };

  const removeUser = (clientUserId: string) => {
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
