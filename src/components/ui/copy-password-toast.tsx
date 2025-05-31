
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CopyPasswordToastProps {
  email: string;
  password: string;
}

export const CopyPasswordToast = ({ email, password }: CopyPasswordToastProps) => {
  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Senha copiada!",
        description: "A senha foi copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <p>Email: {email}</p>
      <p>Senha: {password}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyPassword}
        className="mt-2"
      >
        <Copy className="h-3 w-3 mr-1" />
        Copiar Senha
      </Button>
    </div>
  );
};
