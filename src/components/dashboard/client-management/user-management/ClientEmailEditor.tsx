
import React, { useState } from 'react';
import { Mail, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ClientEmailEditorProps {
  clientEmail: string;
  onUpdateEmail: (newEmail: string) => void;
}

export const ClientEmailEditor = ({ clientEmail, onUpdateEmail }: ClientEmailEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(clientEmail);

  const handleSave = () => {
    if (newEmail !== clientEmail) {
      onUpdateEmail(newEmail);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewEmail(clientEmail);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Mail className="h-5 w-5 text-blue-600" />
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="flex-1"
            placeholder="Email do cliente"
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
          <span className="text-gray-700">{clientEmail}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="p-1 h-auto"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
