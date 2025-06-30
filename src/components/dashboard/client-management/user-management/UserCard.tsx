
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Mail, Clock, Key, Edit2, Save, X as Cancel } from 'lucide-react';
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
  onUpdatePassword?: (userId: string, newPassword: string) => void;
}

export const UserCard = ({ 
  userId,
  userEmail, 
  generatedPassword, 
  authInfo, 
  isPasswordVisible,
  isLoading,
  onTogglePasswordVisibility,
  onRemoveUser,
  onUpdatePassword
}: UserCardProps) => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

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

  const handleSavePassword = () => {
    if (newPassword.trim() && onUpdatePassword) {
      onUpdatePassword(userId, newPassword.trim());
      setNewPassword('');
      setIsEditingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    setNewPassword('');
    setIsEditingPassword(false);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="secondary" className="flex items-center gap-2">
          <Mail className="h-3 w-3" />
          {userEmail}
        </Badge>
        {/* Botão de remover usuário movido para uma posição mais apropriada */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemoveUser}
          disabled={isLoading}
          className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1" />
          Remover
        </Button>
      </div>
      
      <PasswordSection
        password={generatedPassword}
        isVisible={isPasswordVisible}
        userEmail={userEmail}
        onToggleVisibility={onTogglePasswordVisibility}
      />

      {/* Seção de alteração de senha */}
      <div className="mb-3 p-3 bg-white rounded border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Alterar Senha:</span>
          </div>
          {!isEditingPassword && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditingPassword(true)}
              className="h-8 px-2"
              disabled={isLoading}
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Editar
            </Button>
          )}
        </div>

        {isEditingPassword ? (
          <div className="space-y-2">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSavePassword}
                disabled={!newPassword.trim() || isLoading}
                className="flex items-center gap-1"
              >
                <Save className="h-3 w-3" />
                Salvar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center gap-1"
              >
                <Cancel className="h-3 w-3" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-600">
            Clique em "Editar" para alterar a senha de acesso
          </p>
        )}
      </div>
      
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
