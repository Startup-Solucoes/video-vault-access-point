
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface UserAddFormProps {
  onAddUser: (email: string) => void;
  isLoading: boolean;
}

export const UserAddForm = ({ onAddUser, isLoading }: UserAddFormProps) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      onAddUser(email.trim());
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        type="email"
        placeholder="email@exemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
        required
      />
      <Button 
        type="submit" 
        disabled={isLoading || !email.trim() || !email.includes('@')}
        className="px-6 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar Usuário
      </Button>
    </form>
  );
};
