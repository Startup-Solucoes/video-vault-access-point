
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Mail, Clock } from 'lucide-react';
import { PasswordSection } from './PasswordSection';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserCardProps {
  userId: string;
  userEmail: string;
  generatedPassword?: string;
  authInfo?: {
    last_sign_in_at?: string | null;
  };
  isPasswordVisible: boolean;
  isLoading: boolean;
  onTogglePasswordVisibility: () => void;
  onRemoveUser: () => void;
}

export const UserCard = ({ 
  userId,
  userEmail, 
  generatedPassword, 
  authInfo, 
  isPasswordVisible,
  isLoading,
  onTogglePasswordVisibility,
  onRemoveUser 
}: UserCardProps) => {
  console.log('🔍 Renderizando usuário:', {
    id: userId,
    email: userEmail,
    temSenha: !!generatedPassword,
    senha: generatedPassword
  });

  const formatLastAccess = (lastSignIn: string | null | undefined) => {
    if (!lastSignIn) return 'Nunca acessou';
    
    try {
      return format(new Date(lastSignIn), 'dd/MM/yyyy às HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary" className="flex items-center gap-2">
          <Mail className="h-3 w-3" />
          {userEmail}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemoveUser}
          disabled={isLoading}
          className="h-6 w-6 p-0 hover:bg-red-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <PasswordSection
        password={generatedPassword}
        isVisible={isPasswordVisible}
        userEmail={userEmail}
        onToggleVisibility={onTogglePasswordVisibility}
      />
      
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Último acesso:</span>
        </div>
        <span className={authInfo?.last_sign_in_at ? 'text-green-600' : 'text-gray-500'}>
          {formatLastAccess(authInfo?.last_sign_in_at)}
        </span>
      </div>
    </div>
  );
};
