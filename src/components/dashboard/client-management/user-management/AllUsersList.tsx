
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

      {/* Usuários Adicionais */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6 pb-4">
          <Label className="text-lg font-semibold text-gray-900 mb-6 block">
            Usuários Adicionais
          </Label>
          
          {/* Formulário para adicionar usuários - agora mais integrado */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Adicionar Novo Usuário</h4>
            <UserAddForm onAddUser={onAddUser} isLoading={isLoading} />
          </div>
        </div>

        <Separator className="mx-6" />

        {/* Lista de usuários adicionais */}
        <div className="p-6 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Usuários Cadastrados</h4>
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
