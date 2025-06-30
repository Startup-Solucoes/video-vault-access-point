
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Mail } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !email.trim() || !email.includes('@')}
          className="px-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {isLoading ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        O usuário receberá um email com as credenciais de acesso
      </p>
    </form>
  );
};
