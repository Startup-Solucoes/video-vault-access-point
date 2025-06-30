
import React, { useState } from 'react';
import { useClientUsers } from '@/hooks/useClientUsers';
import { getUserAuthInfo } from '@/services/emailNotificationService';
import { updateMainClientPassword } from '@/services/client/mainClientPasswordService';
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
  const [lastUpdatedMainPassword, setLastUpdatedMainPassword] = useState<string | null>(null);
  const [showMainPassword, setShowMainPassword] = useState(false);
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

  const handleUpdateMainClientPassword = async (newPassword: string) => {
    console.log('🔑 Atualizando senha do cliente principal:', { clientEmail, newPassword: '***' });
    
    try {
      await updateMainClientPassword(clientId, newPassword);
      
      // Salvar a senha para exibição temporária
      setLastUpdatedMainPassword(newPassword);
      setShowMainPassword(true);
      
      toast({
        title: "Sucesso",
        description: "Senha do cliente principal atualizada com sucesso",
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar senha do cliente principal:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar senha",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMainClientEmail = (newEmail: string) => {
    console.log('📧 Tentativa de atualizar email do cliente principal:', { oldEmail: clientEmail, newEmail });
    
    toast({
      title: "Funcionalidade em desenvolvimento", 
      description: "A alteração de email do cliente principal será implementada em breve",
      variant: "destructive"
    });
  };

  const handleToggleMainPasswordVisibility = () => {
    setShowMainPassword(!showMainPassword);
  };

  const handleCopyMainPassword = async () => {
    if (!lastUpdatedMainPassword) return;
    
    try {
      await navigator.clipboard.writeText(lastUpdatedMainPassword);
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
      {/* Lista unificada de usuários */}
      <AllUsersList
        clientEmail={clientEmail}
        clientName={clientName}
        clientLogoUrl={clientLogoUrl}
        clientUsers={clientUsers}
        userAuthInfo={userAuthInfo}
        visiblePasswords={visiblePasswords}
        isLoading={isLoading}
        lastUpdatedMainPassword={lastUpdatedMainPassword}
        showMainPassword={showMainPassword}
        onTogglePasswordVisibility={togglePasswordVisibility}
        onRemoveUser={removeUser}
        onUpdatePassword={updatePassword}
        onUpdateMainClientPassword={handleUpdateMainClientPassword}
        onUpdateMainClientEmail={handleUpdateMainClientEmail}
        onToggleMainPasswordVisibility={handleToggleMainPasswordVisibility}
        onCopyMainPassword={handleCopyMainPassword}
        onAddUser={addUser}
      />

      <InfoBanner />
    </div>
  );
};
