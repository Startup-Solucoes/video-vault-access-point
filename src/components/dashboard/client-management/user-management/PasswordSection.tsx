
import React from 'react';
import { Button } from '@/components/ui/button';
import { Key, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PasswordSectionProps {
  password: string | undefined;
  isVisible: boolean;
  userEmail: string;
  onToggleVisibility: () => void;
}

export const PasswordSection = ({ 
  password, 
  isVisible, 
  userEmail, 
  onToggleVisibility 
}: PasswordSectionProps) => {
  const handleCopyPassword = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Senha copiada!",
        description: `Senha do usuário ${userEmail} copiada para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive"
      });
    }
  };

  if (!password) {
    return (
      <div className="mb-3 p-3 bg-yellow-50 rounded border border-yellow-200">
        <div className="flex items-center gap-2 text-yellow-800">
          <Key className="h-4 w-4" />
          <span className="text-sm">Senha não disponível para este usuário</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 p-3 bg-white rounded border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Senha:</span>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            {isVisible ? password : '••••••••••'}
          </code>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="h-8 w-8 p-0"
            title={isVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            {isVisible ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyPassword}
            className="h-8 w-8 p-0"
            title="Copiar senha"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
