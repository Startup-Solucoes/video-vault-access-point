
import React from 'react';
import { MainClientCard } from './MainClientCard';
import { UsersList } from './UsersList';
import { ClientUser } from '@/services/client/clientUsersService';

interface AllUsersListProps {
  clientEmail: string;
  clientName: string;
  clientUsers: ClientUser[];
  userAuthInfo: Record<string, any>;
  visiblePasswords: Record<string, boolean>;
  isLoading: boolean;
  onTogglePasswordVisibility: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onUpdatePassword?: (userId: string, newPassword: string) => void;
  onUpdateMainClientPassword?: (newPassword: string) => void;
}

export const AllUsersList = ({
  clientEmail,
  clientName,
  clientUsers,
  userAuthInfo,
  visiblePasswords,
  isLoading,
  onTogglePasswordVisibility,
  onRemoveUser,
  onUpdatePassword,
  onUpdateMainClientPassword
}: AllUsersListProps) => {
  console.log('🔍 AllUsersList - Dados recebidos:', {
    clientEmail,
    clientName,
    totalUsers: clientUsers.length,
    users: clientUsers.map(u => ({ id: u.id, email: u.user_email }))
  });

  return (
    <div className="space-y-4">
      {/* Card do Cliente Principal */}
      <MainClientCard
        clientEmail={clientEmail}
        clientName={clientName}
        onUpdatePassword={onUpdateMainClientPassword}
        isLoading={isLoading}
      />

      {/* Lista de Usuários Adicionais */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Usuários Adicionais ({clientUsers.length})
        </h4>
        
        {clientUsers.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <div className="text-gray-500 text-sm">
              <p className="font-medium mb-1">Nenhum usuário adicional cadastrado</p>
              <p>Use o formulário acima para adicionar novos usuários de acesso para este cliente.</p>
            </div>
          </div>
        ) : (
          <UsersList
            clientUsers={clientUsers}
            userAuthInfo={userAuthInfo}
            visiblePasswords={visiblePasswords}
            isLoading={isLoading}
            onTogglePasswordVisibility={onTogglePasswordVisibility}
            onRemoveUser={onRemoveUser}
            onUpdatePassword={onUpdatePassword}
          />
        )}
      </div>
    </div>
  );
};
