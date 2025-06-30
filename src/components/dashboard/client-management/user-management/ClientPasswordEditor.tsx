
import React, { useState } from 'react';
import { Key, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ClientPasswordEditorProps {
  onUpdatePassword: (newPassword: string) => void;
}

export const ClientPasswordEditor = ({ onUpdatePassword }: ClientPasswordEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    if (newPassword.trim()) {
      onUpdatePassword(newPassword);
      setNewPassword('');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewPassword('');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Key className="h-5 w-5 text-blue-600" />
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1"
            placeholder="Nova senha"
          />
          <Button
            size="sm"
            onClick={handleSave}
            className="p-2"
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
            onClick={() => setIsEditing(true)}
            className="p-1 h-auto"
            title="Alterar senha"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
