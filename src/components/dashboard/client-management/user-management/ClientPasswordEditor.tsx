
import React, { useState } from 'react';
import { Key, Edit2, Save, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateStrongPassword } from '@/utils/passwordGenerator';

interface ClientPasswordEditorProps {
  onUpdatePassword: (newPassword: string) => void;
}

export const ClientPasswordEditor = ({ onUpdatePassword }: ClientPasswordEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleGeneratePassword = () => {
    const strongPassword = generateStrongPassword();
    setNewPassword(strongPassword);
  };

  const handleSave = () => {
    if (newPassword.trim() && newPassword.length >= 8) {
      onUpdatePassword(newPassword);
      setNewPassword('');
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setNewPassword('');
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    // Gerar automaticamente uma senha forte quando começar a editar
    handleGeneratePassword();
  };

  return (
    <div className="flex items-center gap-2">
      <Key className="h-5 w-5 text-blue-600" />
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1"
            placeholder="Nova senha (mín. 8 caracteres)"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleGeneratePassword}
            className="p-2"
            title="Gerar nova senha forte"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="p-2"
            disabled={!newPassword.trim() || newPassword.length < 8}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          <span className="text-gray-500">••••••••</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleStartEditing}
            className="p-1 h-auto"
            title="Alterar senha (gera senha forte automaticamente)"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
