
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Crown, Key, Eye, EyeOff, Edit2, Save, X as Cancel, Copy, User } from 'lucide-react';
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

  console.log('🔍 MainClientCard - Props recebidas detalhadamente:', { 
    clientEmail: `"${clientEmail}"`,
    clientName: `"${clientName}"`,
    clientEmailType: typeof clientEmail,
    clientNameType: typeof clientName,
    clientEmailLength: clientEmail?.length || 0,
    clientNameLength: clientName?.length || 0,
    hasEmail: !!clientEmail,
    hasName: !!clientName,
    isPlaceholder: clientEmail === 'placeholder@email.com'
  });

  // Verificar se os dados estão chegando corretamente
  React.useEffect(() => {
    console.log('🔍 MainClientCard - useEffect - Verificando dados recebidos:', {
      clientEmail: clientEmail || 'AUSENTE/VAZIO',
      clientName: clientName || 'AUSENTE/VAZIO',
      emailIsPlaceholder: clientEmail === 'placeholder@email.com',
      emailIsEmpty: !clientEmail || clientEmail.trim() === '',
      nameIsEmpty: !clientName || clientName.trim() === ''
    });
    
    if (!clientEmail || clientEmail === 'placeholder@email.com') {
      console.error('❌ MainClientCard - Email do cliente está faltando ou é placeholder:', {
        receivedEmail: clientEmail || 'AUSENTE',
        isPlaceholder: clientEmail === 'placeholder@email.com'
      });
    }
    
    if (!clientName || clientName.trim() === '') {
      console.error('❌ MainClientCard - Nome do cliente está faltando:', {
        receivedName: clientName || 'AUSENTE'
      });
    }
    
    if (clientEmail && clientEmail !== 'placeholder@email.com' && clientName && clientName.trim() !== '') {
      console.log('✅ MainClientCard - Dados válidos recebidos!');
    }
  }, [clientEmail, clientName]);

  const handleSavePassword = () => {
    console.log('💾 Salvando nova senha para cliente:', clientEmail);
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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(clientEmail);
      toast({
        title: "Email copiado!",
        description: `Email ${clientEmail} copiado para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o email",
        variant: "destructive"
      });
    }
  };

  // Verificar se temos dados válidos (não placeholder)
  const hasValidEmail = clientEmail && clientEmail !== 'placeholder@email.com' && clientEmail.trim() !== '';
  const hasValidName = clientName && clientName.trim() !== '';
  
  // Dados para exibição
  const displayEmail = hasValidEmail ? clientEmail : 'Email não disponível';
  const displayName = hasValidName ? clientName : 'Nome não disponível';

  console.log('🔍 MainClientCard - Dados processados para exibição:', {
    hasValidEmail,
    hasValidName,
    displayEmail,
    displayName
  });

  return (
    <div className="space-y-4">
      {/* Debug info - mostrar apenas se dados não estão válidos */}
      {(!hasValidEmail || !hasValidName) && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Debug: Dados do cliente não recebidos completamente
            <br />Email válido: {hasValidEmail ? '✅' : '❌'} | Nome válido: {hasValidName ? '✅' : '❌'}
            <br />Email recebido: "{clientEmail}"
            <br />Nome recebido: "{clientName}"
          </p>
        </div>
      )}

      {/* Informações do Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="h-4 w-4" />
            Nome do Cliente
          </label>
          <div className="p-3 bg-gray-50 rounded-lg border">
            <span className="text-sm font-medium text-gray-900">{displayName}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email de Acesso
          </label>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
            <span className="text-sm font-medium text-gray-900 flex-1">{displayEmail}</span>
            {hasValidEmail && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyEmail}
                className="h-8 w-8 p-0"
                title="Copiar email"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Permissões */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Privilégios de Acesso</span>
        </div>
        <p className="text-sm text-blue-800">
          Este usuário possui acesso total ao dashboard como administrador principal do cliente.
        </p>
      </div>

      {/* Seção de Senha */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Key className="h-4 w-4" />
          Senha de Acesso
        </label>
        
        {isEditingPassword ? (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
              className="bg-white"
            />
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSavePassword}
                disabled={!newPassword.trim() || isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar Nova Senha
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="flex items-center gap-2"
              >
                <Cancel className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {showPassword ? "••••••••••••" : "Senha não exibida por segurança"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8 p-0"
                  title={showPassword ? "Ocultar indicador" : "Mostrar indicador"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPassword(true)}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Alterar Senha
                </Button>
              </div>
            </div>
            
            {showPassword && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-700">
                  ⚠️ Por motivos de segurança, a senha atual não pode ser exibida. 
                  Use "Alterar Senha" para definir uma nova senha de acesso.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
