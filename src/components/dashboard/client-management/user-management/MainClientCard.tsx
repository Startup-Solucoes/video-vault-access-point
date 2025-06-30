
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Key, Edit2, Save, X, Image, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MainClientCardProps {
  clientEmail: string;
  clientName: string;
  clientLogoUrl?: string;
  onUpdatePassword: (newPassword: string) => void;
  onUpdateEmail: (newEmail: string) => void;
}

export const MainClientCard = ({
  clientEmail,
  clientName,
  clientLogoUrl,
  onUpdatePassword,
  onUpdateEmail
}: MainClientCardProps) => {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState(clientEmail);
  const [newPassword, setNewPassword] = useState('');
  const [lastUpdatedPassword, setLastUpdatedPassword] = useState<string | null>(null);
  const [showLastPassword, setShowLastPassword] = useState(false);

  console.log('🔍 MainClientCard - Dados do cliente principal:', {
    clientEmail,
    clientName,
    clientLogoUrl,
    hasLogo: !!clientLogoUrl
  });

  const handleSaveEmail = () => {
    if (newEmail !== clientEmail) {
      onUpdateEmail(newEmail);
    }
    setIsEditingEmail(false);
  };

  const handleSavePassword = () => {
    if (newPassword.trim()) {
      setLastUpdatedPassword(newPassword);
      setShowLastPassword(true);
      onUpdatePassword(newPassword);
      setNewPassword('');
    }
    setIsEditingPassword(false);
  };

  const handleCancelEmail = () => {
    setNewEmail(clientEmail);
    setIsEditingEmail(false);
  };

  const handleCancelPassword = () => {
    setNewPassword('');
    setIsEditingPassword(false);
  };

  const handleCopyLastPassword = async () => {
    if (!lastUpdatedPassword) return;
    
    try {
      await navigator.clipboard.writeText(lastUpdatedPassword);
      toast({
        title: "Senha copiada!",
        description: `Senha do cliente principal copiada para a área de transferência`,
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
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo do Cliente */}
          <div className="flex-shrink-0">
            {clientLogoUrl ? (
              <img
                src={clientLogoUrl}
                alt={`Logo ${clientName}`}
                className="w-16 h-16 rounded-lg object-cover border-2 border-blue-300 bg-white p-1"
                onError={(e) => {
                  console.error('Erro ao carregar logo:', clientLogoUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-blue-300"><svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                  }
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-blue-300">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            )}
          </div>

          {/* Informações do Cliente */}
          <div className="flex-1 space-y-4">
            {/* Nome do Cliente */}
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <span className="font-semibold text-gray-900">{clientName}</span>
                <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-300">
                  Administrador Principal
                </Badge>
              </div>
            </div>

            {/* Email do Cliente */}
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              {isEditingEmail ? (
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
                    onClick={handleSaveEmail}
                    className="p-2"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEmail}
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
                    onClick={() => setIsEditingEmail(true)}
                    className="p-1 h-auto"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Senha do Cliente */}
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              {isEditingPassword ? (
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
                    onClick={handleSavePassword}
                    className="p-2"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelPassword}
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
                    onClick={() => setIsEditingPassword(true)}
                    className="p-1 h-auto"
                    title="Alterar senha"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Última senha atualizada */}
            {lastUpdatedPassword && (
              <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Última senha alterada:</span>
                    <code className="text-sm bg-white px-2 py-1 rounded border">
                      {showLastPassword ? lastUpdatedPassword : '••••••••••'}
                    </code>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLastPassword(!showLastPassword)}
                      className="h-8 w-8 p-0"
                      title={showLastPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showLastPassword ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyLastPassword}
                      className="h-8 w-8 p-0"
                      title="Copiar senha"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
