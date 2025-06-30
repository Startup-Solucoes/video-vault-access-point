
import React from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { MainClientCard } from './MainClientCard';
import { UsersList } from './UsersList';

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
  onCopyMainPassword
}: AllUsersListProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <Label className="text-lg font-semibold text-gray-900 mb-4 block">
          Usuários com Acesso
        </Label>
        
        {/* Cliente Principal */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-700 mb-3">Cliente Principal</h3>
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

        <Separator className="my-6" />

        {/* Usuários Adicionais */}
        <div>
          <h3 className="text-base font-medium text-gray-700 mb-3">Usuários Adicionais</h3>
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
