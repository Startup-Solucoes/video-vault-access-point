
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useClientUsers } from '@/hooks/useClientUsers';
import { getUserAuthInfo } from '@/services/emailNotificationService';
import { UserAddForm } from './user-management/UserAddForm';
import { AllUsersList } from './user-management/AllUsersList';
import { InfoBanner } from './user-management/InfoBanner';
import { toast } from '@/hooks/use-toast';

interface ClientUsersManagerProps {
  clientId: string;
  clientEmail: string;
  clientName: string;
}

export const ClientUsersManager = ({ clientId, clientEmail, clientName }: ClientUsersManagerProps) => {
  const [userAuthInfo, setUserAuthInfo] = useState<Record<string, any>>({});
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const { clientUsers, isLoading, addUser, removeUser, updatePassword } = useClientUsers(clientId);

  console.log('🔍 ClientUsersManager - Dados do cliente:', { clientId, clientEmail, clientName });
  console.log('🔍 ClientUsersManager - clientUsers:', clientUsers);

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleUpdateMainClientPassword = (newPassword: string) => {
    // Por enquanto, apenas mostra uma mensagem informativa
    // Em uma implementação real, seria necessário uma função específica para alterar a senha do cliente principal
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A alteração de senha do cliente principal será implementada em breve",
      variant: "destructive"
    });
  };

  // Buscar informações de autenticação dos usuários
  React.useEffect(() => {
    const fetchAuthInfo = async () => {
      const authData: Record<string, any> = {};
      
      for (const user of clientUsers) {
        try {
          const info = await getUserAuthInfo(user.id);
          authData[user.id] = info;
        } catch (error) {
          console.error('Erro ao buscar info de auth:', error);
          authData[user.id] = { email_confirmed_at: null, last_sign_in_at: null };
        }
      }
      
      setUserAuthInfo(authData);
    };

    if (clientUsers.length > 0) {
      fetchAuthInfo();
    }
  }, [clientUsers]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div>
        <Label className="text-base font-semibold text-gray-900">Gerenciamento de Usuários</Label>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie os usuários que têm acesso ao dashboard deste cliente
        </p>
      </div>
      
      <Separator />
      
      {/* Formulário para adicionar usuários */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Usuário</h3>
        <UserAddForm onAddUser={addUser} isLoading={isLoading} />
      </div>

      {/* Lista de todos os usuários */}
      <AllUsersList
        clientEmail={clientEmail}
        clientName={clientName}
        clientUsers={clientUsers}
        userAuthInfo={userAuthInfo}
        visiblePasswords={visiblePasswords}
        isLoading={isLoading}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onRemoveUser={removeUser}
        onUpdatePassword={updatePassword}
        onUpdateMainClientPassword={handleUpdateMainClientPassword}
      />

      <InfoBanner />
    </div>
  );
};
