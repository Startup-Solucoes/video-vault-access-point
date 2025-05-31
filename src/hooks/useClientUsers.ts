
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
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

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Senha copiada!",
        description: "A senha foi copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive"
      });
    }
  };

  const addUserMutation = useMutation({
    mutationFn: ({ userEmail }: { userEmail: string }) =>
      addClientUser(clientId!, userEmail, user!.id),
    onSuccess: (result: CreateUserResult) => {
      queryClient.invalidateQueries({ queryKey });
      
      const copyButton = (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleCopyPassword(result.password)}
          className="ml-2"
        >
          <Copy className="h-3 w-3 mr-1" />
          Copiar Senha
        </Button>
      );

      toast({
        title: "Usuário criado com sucesso",
        description: (
          <div className="space-y-2">
            <p>Email: {result.user.email}</p>
            <p>Senha: {result.password}</p>
            <div>{copyButton}</div>
          </div>
        ),
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
