
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useClientUsers } from '@/hooks/useClientUsers';
import { getUserAuthInfo } from '@/services/emailNotificationService';
import { UserAddForm } from './user-management/UserAddForm';
import { AllUsersList } from './user-management/AllUsersList';
import { InfoBanner } from './user-management/InfoBanner';
import { toast } from '@/hooks/use-toast';

interface ClientUsersManagerProps {
  clientId: string;
  clientEmail: string;
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientUsersManager = ({ 
  clientId, 
  clientEmail, 
  clientName, 
  clientLogoUrl 
}: ClientUsersManagerProps) => {
  const [userAuthInfo, setUserAuthInfo] = useState<Record<string, any>>({});
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const { clientUsers, isLoading, addUser, removeUser, updatePassword } = useClientUsers(clientId);

  console.log('🔍 ClientUsersManager - Dados completos do cliente:', { 
    clientId, 
    clientEmail, 
    clientName,
    clientLogoUrl,
    clientUsersCount: clientUsers.length
  });

  const togglePasswordVisibility = (userId: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleUpdateMainClientPassword = (newPassword: string) => {
    console.log('🔑 Tentativa de atualizar senha do cliente principal:', { clientEmail, newPassword: '***' });
    
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A alteração de senha do cliente principal será implementada em breve",
      variant: "destructive"
    });
  };

  const handleUpdateMainClientEmail = (newEmail: string) => {
    console.log('📧 Tentativa de atualizar email do cliente principal:', { oldEmail: clientEmail, newEmail });
    
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "A alteração de email do cliente principal será implementada em breve",
      variant: "destructive"
    });
  };

  // Buscar informações de autenticação dos usuários
  React.useEffect(() => {
    const fetchAuthInfo = async () => {
      if (clientUsers.length === 0) return;
      
      console.log('📊 Buscando informações de autenticação para usuários:', clientUsers.length);
      const authData: Record<string, any> = {};
      
      for (const user of clientUsers) {
        try {
          console.log('🔍 Buscando auth info para usuário:', user.id, user.user_email);
          const info = await getUserAuthInfo(user.id);
          authData[user.id] = info;
          console.log('✅ Auth info obtida para:', user.user_email, info);
        } catch (error) {
          console.error('❌ Erro ao buscar info de auth para', user.user_email, ':', error);
          authData[user.id] = { email_confirmed_at: null, last_sign_in_at: null };
        }
      }
      
      setUserAuthInfo(authData);
      console.log('📋 Todas as informações de auth coletadas:', authData);
    };

    fetchAuthInfo();
  }, [clientUsers]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da seção */}
      <div>
        <Label className="text-base font-semibold text-gray-900">Gerenciamento de Usuários</Label>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie os usuários que têm acesso ao dashboard deste cliente
        </p>
      </div>
      
      <Separator />
      
      {/* Formulário para adicionar usuários */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Novo Usuário</h3>
        <UserAddForm onAddUser={addUser} isLoading={isLoading} />
      </div>

      {/* Lista de todos os usuários */}
      <AllUsersList
        clientEmail={clientEmail}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        clientUsers={clientUsers}
        userAuthInfo={userAuthInfo}
        visiblePasswords={visiblePasswords}
        isLoading={isLoading}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onRemoveUser={removeUser}
        onUpdatePassword={updatePassword}
        onUpdateMainClientPassword={handleUpdateMainClientPassword}
        onUpdateMainClientEmail={handleUpdateMainClientEmail}
      />

      <InfoBanner />
    </div>
  );
};
