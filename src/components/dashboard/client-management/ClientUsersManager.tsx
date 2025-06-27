
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useClientUsers } from '@/hooks/useClientUsers';
import { getUserAuthInfo } from '@/services/emailNotificationService';
import { UserAddForm } from './user-management/UserAddForm';
import { UsersList } from './user-management/UsersList';
import { InfoBanner } from './user-management/InfoBanner';

interface ClientUsersManagerProps {
  clientId: string;
}

export const ClientUsersManager = ({ clientId }: ClientUsersManagerProps) => {
  const [userAuthInfo, setUserAuthInfo] = useState<Record<string, any>>({});
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const { clientUsers, isLoading, addUser, removeUser } = useClientUsers(clientId);

  console.log('🔍 ClientUsersManager - clientUsers:', clientUsers);
  console.log('🔍 ClientUsersManager - cada usuário:', clientUsers.map(u => ({
    id: u.id,
    email: u.user_email,
    senha: u.generated_password,
    temSenha: !!u.generated_password
  })));

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
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
      <Label className="text-sm font-medium">Usuários Associados</Label>
      
      <UserAddForm onAddUser={addUser} isLoading={isLoading} />

      <div className="space-y-3">
        <UsersList
          clientUsers={clientUsers}
          userAuthInfo={userAuthInfo}
          visiblePasswords={visiblePasswords}
          isLoading={isLoading}
          onTogglePasswordVisibility={togglePasswordVisibility}
          onRemoveUser={removeUser}
        />
      </div>

      <InfoBanner />
    </div>
  );
};
