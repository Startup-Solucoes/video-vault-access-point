
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Mail, Key, Clock, CheckCircle } from 'lucide-react';
import { useClientUsers } from '@/hooks/useClientUsers';
import { getUserAuthInfo } from '@/services/emailNotificationService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientUsersManagerProps {
  clientId: string;
}

export const ClientUsersManager = ({ clientId }: ClientUsersManagerProps) => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [userAuthInfo, setUserAuthInfo] = useState<Record<string, any>>({});
  const { clientUsers, isLoading, addUser, removeUser } = useClientUsers(clientId);

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return;
    
    const email = newUserEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    addUser(email);
    setNewUserEmail('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUser();
    }
  };

  // Buscar informações de autenticação dos usuários
  React.useEffect(() => {
    const fetchAuthInfo = async () => {
      const authData: Record<string, any> = {};
      
      for (const user of clientUsers) {
        try {
          const info = await getUserAuthInfo(user.id);
          authData[user.id] = info;
        } catch (error) {
          console.error('Erro ao buscar info de auth:', error);
          authData[user.id] = { email_confirmed_at: null, last_sign_in_at: null };
        }
      }
      
      setUserAuthInfo(authData);
    };

    if (clientUsers.length > 0) {
      fetchAuthInfo();
    }
  }, [clientUsers]);

  const formatLastAccess = (lastSignIn: string | null) => {
    if (!lastSignIn) return 'Nunca acessou';
    
    try {
      return format(new Date(lastSignIn), 'dd/MM/yyyy às HH:mm', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Usuários Associados</Label>
      
      {/* Add new user */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="email@exemplo.com"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            type="email"
            disabled={isLoading}
          />
          <Button 
            onClick={handleAddUser}
            disabled={isLoading || !newUserEmail.trim()}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <Key className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-blue-600 flex items-center gap-1">
            <Key className="h-3 w-3" />
            Uma senha será gerada automaticamente e exibida após a criação
          </p>
          <p className="text-xs text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Email de confirmação desabilitado - usuário pode fazer login diretamente
          </p>
        </div>
      </div>

      {/* List of current users */}
      <div className="space-y-3">
        {isLoading && clientUsers.length === 0 ? (
          <div className="text-sm text-gray-500">Carregando usuários...</div>
        ) : clientUsers.length === 0 ? (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Nenhum usuário adicional associado
          </div>
        ) : (
          <div className="space-y-3">
            {clientUsers.map((clientUser) => {
              const authInfo = userAuthInfo[clientUser.id];
              return (
                <div key={clientUser.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {clientUser.user_email}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUser(clientUser.id)}
                      disabled={isLoading}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
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
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="space-y-2">
          <p className="text-xs text-blue-800 flex items-center gap-2">
            <Key className="h-4 w-4" />
            <strong>Criação de usuários:</strong> Quando um usuário for criado, a senha gerada será exibida na notificação. 
            Certifique-se de copiar e compartilhar com segurança.
          </p>
          <p className="text-xs text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <strong>Email de confirmação desabilitado:</strong> Os usuários podem fazer login diretamente sem confirmar o email.
          </p>
        </div>
      </div>
    </div>
  );
};
