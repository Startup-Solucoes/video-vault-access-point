
import React from 'react';
import { Mail, Crown, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserCard } from './UserCard';
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
}

export const AllUsersList = ({ 
  clientEmail,
  clientName,
  clientUsers, 
  userAuthInfo, 
  visiblePasswords, 
  isLoading,
  onTogglePasswordVisibility,
  onRemoveUser 
}: AllUsersListProps) => {
  const totalUsers = 1 + clientUsers.length; // Cliente principal + usuários adicionais

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          Todos os Emails com Acesso ({totalUsers})
        </h3>
        <Badge variant="outline" className="text-xs">
          {totalUsers} usuário{totalUsers > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Cliente Principal */}
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="default" className="flex items-center gap-2 bg-blue-600">
              <Crown className="h-3 w-3" />
              Cliente Principal
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{clientEmail}</span>
          </div>
          
          <div className="text-xs text-blue-700">
            <strong>{clientName}</strong> - Acesso total ao dashboard
          </div>
        </div>

        {/* Usuários Adicionais */}
        {clientUsers.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>Usuários Adicionais:</span>
            </div>
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
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 p-4 text-center border rounded-lg bg-gray-50">
            <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            Nenhum usuário adicional cadastrado
          </div>
        )}
      </div>
    </div>
  );
};
