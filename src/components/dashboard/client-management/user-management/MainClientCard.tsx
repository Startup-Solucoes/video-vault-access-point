
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Crown, Key, Eye, EyeOff, Edit2, Save, X as Cancel } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MainClientCardProps {
  clientEmail: string;
  clientName: string;
  onUpdatePassword?: (newPassword: string) => void;
  isLoading?: boolean;
}

export const MainClientCard = ({ 
  clientEmail, 
  clientName, 
  onUpdatePassword,
  isLoading = false 
}: MainClientCardProps) => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword] = useState('••••••••••'); // Placeholder - senha real não é exibida por segurança

  const handleSavePassword = () => {
    if (newPassword.trim() && onUpdatePassword) {
      onUpdatePassword(newPassword.trim());
      setNewPassword('');
      setIsEditingPassword(false);
      toast({
        title: "Senha atualizada",
        description: "A senha do cliente principal foi atualizada com sucesso",
      });
    }
  };

  const handleCancelEdit = () => {
    setNewPassword('');
    setIsEditingPassword(false);
  };

  return (
    <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="default" className="flex items-center gap-2 bg-blue-600">
          <Crown className="h-3 w-3" />
          Cliente Principal
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">{clientEmail}</span>
      </div>
      
      <div className="text-xs text-blue-700 mb-4">
        <strong>{clientName}</strong> - Acesso total ao dashboard
      </div>

      {/* Seção de senha */}
      <div className="p-3 bg-white rounded border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Senha de Acesso:</span>
          </div>
          {!isEditingPassword && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 w-8 p-0"
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingPassword(true)}
                className="h-8 px-2"
                disabled={isLoading}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Alterar
              </Button>
            </div>
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
          <div className="flex items-center gap-2">
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              {showPassword ? "Senha não disponível por segurança" : currentPassword}
            </code>
          </div>
        )}
      </div>
    </div>
  );
};
