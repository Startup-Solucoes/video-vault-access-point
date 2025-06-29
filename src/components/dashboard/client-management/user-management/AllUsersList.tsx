
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
  onUpdateMainClientEmail?: (newEmail: string) => void;
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
  onUpdateMainClientPassword,
  onUpdateMainClientEmail
}: AllUsersListProps) => {
  console.log('🔍 AllUsersList - Dados recebidos:', {
    clientEmail,
    clientName,
    totalUsers: clientUsers.length,
    users: clientUsers.map(u => ({ id: u.id, email: u.user_email }))
  });

  return (
    <div className="space-y-6">
      {/* Seção do Cliente Principal - Layout melhorado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">👑</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Cliente Principal</h3>
        </div>
        
        <MainClientCard
          clientEmail={clientEmail}
          clientName={clientName}
          onUpdatePassword={onUpdateMainClientPassword}
          onUpdateEmail={onUpdateMainClientEmail}
          isLoading={isLoading}
        />
      </div>

      {/* Seção de Usuários Adicionais - Layout melhorado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-semibold text-sm">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Usuários Adicionais
            </h3>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-600">{clientUsers.length}</span>
          </div>
        </div>
        
        {clientUsers.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400 text-xl">👤</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-1">Nenhum usuário adicional</h4>
            <p className="text-sm text-gray-600">
              Use o formulário acima para adicionar novos usuários de acesso para este cliente.
            </p>
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
