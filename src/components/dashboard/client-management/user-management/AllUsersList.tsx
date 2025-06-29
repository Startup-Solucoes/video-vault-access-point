
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { MainClientCard } from './MainClientCard';
import { UsersList } from './UsersList';
import { ClientUser } from '@/services/client/clientUsersService';

interface AllUsersListProps {
  clientEmail: string;
  clientName: string;
  clientLogoUrl?: string;
  clientUsers: ClientUser[];
  userAuthInfo: Record<string, any>;
  visiblePasswords: Record<string, boolean>;
  isLoading: boolean;
  onTogglePasswordVisibility: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onUpdatePassword?: (userId: string, newPassword: string) => void;
  onUpdateMainClientPassword: (newPassword: string) => void;
  onUpdateMainClientEmail: (newEmail: string) => void;
}

export const AllUsersList = ({ 
  clientEmail,
  clientName,
  clientLogoUrl,
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
    clientLogoUrl,
    totalUsers: clientUsers.length,
    users: clientUsers.map(u => ({ id: u.id, email: u.user_email }))
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuários com Acesso</h3>
      
      {/* Cliente Principal */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Cliente Principal</h4>
        <MainClientCard
          clientEmail={clientEmail}
          clientName={clientName}
          clientLogoUrl={clientLogoUrl}
          onUpdatePassword={onUpdateMainClientPassword}
          onUpdateEmail={onUpdateMainClientEmail}
        />
      </div>

      <Separator className="my-6" />

      {/* Usuários Adicionais */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Usuários Adicionais</h4>
        <UsersList
          clientUsers={clientUsers}
          userAuthInfo={userAuthInfo}
          visiblePasswords={visiblePasswords}
          isLoading={isLoading}
          onTogglePasswordVisibility={onTogglePasswordVisibility}
          onRemoveUser={onRemoveUser}
          onUpdatePassword={onUpdatePassword}
        />
      </div>
    </div>
  );
};
