
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
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
    <div className="space-y-4">
      <Label className="text-sm font-medium">Gerenciamento de Usuários</Label>
      
      <UserAddForm onAddUser={addUser} isLoading={isLoading} />

      <div className="space-y-3">
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
      </div>

      <InfoBanner />
    </div>
  );
};
