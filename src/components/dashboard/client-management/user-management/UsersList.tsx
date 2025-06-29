
import React from 'react';
import { Mail } from 'lucide-react';
import { UserCard } from './UserCard';
import { ClientUser } from '@/services/client/clientUsersService';

interface UsersListProps {
  clientUsers: ClientUser[];
  userAuthInfo: Record<string, any>;
  visiblePasswords: Record<string, boolean>;
  isLoading: boolean;
  onTogglePasswordVisibility: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onUpdatePassword?: (userId: string, newPassword: string) => void;
}

export const UsersList = ({ 
  clientUsers, 
  userAuthInfo, 
  visiblePasswords, 
  isLoading,
  onTogglePasswordVisibility,
  onRemoveUser,
  onUpdatePassword
}: UsersListProps) => {
  if (isLoading && clientUsers.length === 0) {
    return <div className="text-sm text-gray-500">Carregando usuários...</div>;
  }

  if (clientUsers.length === 0) {
    return (
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Nenhum usuário adicional associado
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {clientUsers.map((clientUser) => (
        <UserCard
          key={clientUser.id}
          userId={clientUser.id}
          userEmail={clientUser.user_email}
          generatedPassword={clientUser.generated_password}
          authInfo={userAuthInfo[clientUser.id]}
          isPasswordVisible={visiblePasswords[clientUser.id]}
          isLoading={isLoading}
          onTogglePasswordVisibility={() => onTogglePasswordVisibility(clientUser.id)}
          onRemoveUser={() => onRemoveUser(clientUser.id)}
          onUpdatePassword={onUpdatePassword}
        />
      ))}
    </div>
  );
};
