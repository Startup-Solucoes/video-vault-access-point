
import React from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MainClientCard } from './MainClientCard';
import { UsersList } from './UsersList';
import { UserAddForm } from './UserAddForm';

interface AllUsersListProps {
  clientEmail: string;
  clientName: string;
  clientLogoUrl?: string;
  clientUsers: any[];
  userAuthInfo: Record<string, any>;
  visiblePasswords: Record<string, boolean>;
  isLoading: boolean;
  lastUpdatedMainPassword?: string | null;
  showMainPassword?: boolean;
  onTogglePasswordVisibility: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  onUpdatePassword: (userId: string, newPassword: string) => void;
  onUpdateMainClientPassword: (newPassword: string) => void;
  onUpdateMainClientEmail: (newEmail: string) => void;
  onToggleMainPasswordVisibility?: () => void;
  onCopyMainPassword?: () => void;
  onAddUser: (email: string) => void;
}

export const AllUsersList = ({
  clientEmail,
  clientName,
  clientLogoUrl,
  clientUsers,
  userAuthInfo,
  visiblePasswords,
  isLoading,
  lastUpdatedMainPassword,
  showMainPassword = false,
  onTogglePasswordVisibility,
  onRemoveUser,
  onUpdatePassword,
  onUpdateMainClientPassword,
  onUpdateMainClientEmail,
  onToggleMainPasswordVisibility,
  onCopyMainPassword,
  onAddUser
}: AllUsersListProps) => {
  return (
    <div className="space-y-6">
      {/* Cliente Principal */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
          Cliente Principal
        </Label>
        <MainClientCard
          clientEmail={clientEmail}
          clientName={clientName}
          clientLogoUrl={clientLogoUrl}
          lastUpdatedPassword={lastUpdatedMainPassword}
          showLastPassword={showMainPassword}
          onUpdatePassword={onUpdateMainClientPassword}
          onUpdateEmail={onUpdateMainClientEmail}
          onTogglePasswordVisibility={onToggleMainPasswordVisibility}
          onCopyLastPassword={onCopyMainPassword}
        />
      </div>

      {/* Usuários Adicionais - Layout Reorganizado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <Label className="text-lg font-semibold text-gray-900 mb-6 block">
          Usuários Adicionais
        </Label>
        
        {/* Formulário para adicionar usuários */}
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium mr-2">
                NOVO
              </span>
              Adicionar Novo Usuário
            </h4>
            <UserAddForm onAddUser={onAddUser} isLoading={isLoading} />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Lista de usuários cadastrados */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium mr-2">
              {clientUsers.length}
            </span>
            Usuários Cadastrados
          </h4>
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
    </div>
  );
};
