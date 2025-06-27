
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus } from 'lucide-react';

interface UserAddFormProps {
  onAddUser: (email: string) => void;
  isLoading: boolean;
}

export const UserAddForm = ({
  onAddUser,
  isLoading
}: UserAddFormProps) => {
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleAddUser = () => {
    if (!newUserEmail.trim()) return;
    const email = newUserEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    onAddUser(email);
    setNewUserEmail('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUser();
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        placeholder="email@exemplo.com"
        value={newUserEmail}
        onChange={(e) => setNewUserEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        type="email"
        disabled={isLoading}
        className="flex-1"
      />
      <Button
        onClick={handleAddUser}
        disabled={isLoading || !newUserEmail.trim()}
        size="sm"
        className="flex items-center gap-2 px-4"
      >
        <UserPlus className="h-4 w-4" />
        Adicionar Usuário
      </Button>
    </div>
  );
};
