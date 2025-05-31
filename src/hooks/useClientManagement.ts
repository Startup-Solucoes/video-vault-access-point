
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Client, EditClientForm } from '@/types/client';

export const useClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchClients = async () => {
    try {
      console.log('Buscando todos os clientes...');
      setIsLoading(true);
      
      // Buscar dados dos perfis
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Erro ao buscar perfis:', profilesError);
        throw profilesError;
      }

      // Buscar dados de autenticação (apenas admins podem fazer isso)
      const { data: { user } } = await supabase.auth.getUser();
      let authData: any[] = [];
      
      if (user) {
        try {
          // Tentar buscar dados de auth usando admin API
          const { data, error } = await supabase.auth.admin.listUsers();
          if (!error && data?.users) {
            authData = data.users;
          }
        } catch (error) {
          console.log('Não foi possível acessar dados de autenticação:', error);
        }
      }

      // Combinar dados dos perfis com dados de autenticação
      const combinedData = profilesData?.map(profile => {
        const authUser = authData.find(auth => auth.id === profile.id);
        return {
          ...profile,
          email_confirmed_at: authUser?.email_confirmed_at,
          last_sign_in_at: authUser?.last_sign_in_at
        };
      }) || [];

      console.log('Clientes encontrados:', combinedData);
      setClients(combinedData);
      setFilteredClients(combinedData);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (clientId: string, editForm: EditClientForm) => {
    try {
      console.log('Atualizando cliente:', clientId, editForm);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          email: editForm.email,
          logo_url: editForm.logo_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientId);

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso"
      });

      fetchClients();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente",
        variant: "destructive"
      });
    }
  };

  const approveClient = async (clientId: string, clientEmail: string) => {
    try {
      console.log('Aprovando cliente manualmente:', clientId);
      
      // Usar admin API para confirmar email manualmente
      const { error } = await supabase.auth.admin.updateUserById(clientId, {
        email_confirm: true
      });

      if (error) {
        console.error('Erro ao aprovar cliente:', error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: `Cliente ${clientEmail} aprovado com sucesso`
      });

      fetchClients();
    } catch (error) {
      console.error('Erro ao aprovar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar cliente. Verifique se você tem permissões de administrador.",
        variant: "destructive"
      });
    }
  };

  const deleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`Tem certeza que deseja remover o cliente "${clientName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      console.log('Removendo cliente:', clientId);
      
      const { error } = await supabase.auth.admin.deleteUser(clientId);

      if (error) {
        console.error('Erro ao remover cliente:', error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Cliente removido com sucesso"
      });

      fetchClients();
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover cliente",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients;

    // Filtrar por status
    if (activeTab === 'verified') {
      filtered = clients.filter(client => client.email_confirmed_at);
    } else if (activeTab === 'unverified') {
      filtered = clients.filter(client => !client.email_confirmed_at);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  }, [searchTerm, clients, activeTab]);

  const getTabCounts = () => {
    const verified = clients.filter(c => c.email_confirmed_at).length;
    const unverified = clients.filter(c => !c.email_confirmed_at).length;
    return { all: clients.length, verified, unverified };
  };

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    isLoading,
    activeTab,
    setActiveTab,
    fetchClients,
    updateClient,
    approveClient,
    deleteClient,
    getTabCounts
  };
};
