
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Mail } from 'lucide-react';
import { useClientUsers } from '@/hooks/useClientUsers';

interface ClientUsersManagerProps {
  clientId: string;
}

export const ClientUsersManager = ({ clientId }: ClientUsersManagerProps) => {
  const [newUserEmail, setNewUserEmail] = useState('');
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

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Usuários Associados</Label>
      
      {/* Add new user */}
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
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* List of current users */}
      <div className="space-y-2">
        {isLoading && clientUsers.length === 0 ? (
          <div className="text-sm text-gray-500">Carregando usuários...</div>
        ) : clientUsers.length === 0 ? (
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Nenhum usuário adicional associado
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {clientUsers.map((clientUser) => (
              <Badge key={clientUser.id} variant="secondary" className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                {clientUser.user_email}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUser(clientUser.id)}
                  disabled={isLoading}
                  className="h-4 w-4 p-0 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Adicione e-mails de usuários que terão acesso aos recursos deste cliente
      </p>
    </div>
  );
};
