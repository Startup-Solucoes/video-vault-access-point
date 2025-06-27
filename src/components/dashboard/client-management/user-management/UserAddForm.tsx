import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Key, CheckCircle } from 'lucide-react';
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
  return <div className="space-y-2">
      <div className="flex gap-2">
        <Input placeholder="email@exemplo.com" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} onKeyPress={handleKeyPress} type="email" disabled={isLoading} />
        <Button onClick={handleAddUser} disabled={isLoading || !newUserEmail.trim()} size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <Key className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-blue-600 flex items-center gap-1">
          <Key className="h-3 w-3" />
          Uma senha será gerada automaticamente e exibida após a criação
        </p>
        
      </div>
    </div>;
};