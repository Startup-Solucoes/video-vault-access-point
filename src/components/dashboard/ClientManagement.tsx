
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Edit2, Trash2, UserCheck, UserX, Search, Mail, Clock, CheckCircle } from 'lucide-react';

interface Client {
  id: string;
  email: string;
  full_name: string;
  logo_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
}

export const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    logo_url: ''
  });

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

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setEditForm({
      full_name: client.full_name,
      email: client.email,
      logo_url: client.logo_url || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;

    try {
      console.log('Atualizando cliente:', editingClient.id, editForm);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          email: editForm.email,
          logo_url: editForm.logo_url || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingClient.id);

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
      }

      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso"
      });

      setIsEditDialogOpen(false);
      setEditingClient(null);
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

  const handleApproveClient = async (clientId: string, clientEmail: string) => {
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

  const handleDeleteClient = async (clientId: string, clientName: string) => {
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (client: Client) => {
    if (client.email_confirmed_at) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verificado
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      );
    }
  };

  const getTabCounts = () => {
    const verified = clients.filter(c => c.email_confirmed_at).length;
    const unverified = clients.filter(c => !c.email_confirmed_at).length;
    return { all: clients.length, verified, unverified };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const counts = getTabCounts();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Clientes</CardTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Todos ({counts.all})
              </TabsTrigger>
              <TabsTrigger value="verified">
                Verificados ({counts.verified})
              </TabsTrigger>
              <TabsTrigger value="unverified">
                Pendentes ({counts.unverified})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {clients.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último acesso</TableHead>
                        <TableHead>Cadastrado em</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              {client.logo_url && (
                                <img
                                  src={client.logo_url}
                                  alt="Logo"
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                              <span>{client.full_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{getStatusBadge(client)}</TableCell>
                          <TableCell>{formatDate(client.last_sign_in_at)}</TableCell>
                          <TableCell>{formatDate(client.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClient(client)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              {!client.email_confirmed_at && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApproveClient(client.id, client.email)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClient(client.id, client.full_name)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editForm.full_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Nome completo do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-logo">URL da Logo (opcional)</Label>
              <Input
                id="edit-logo"
                value={editForm.logo_url}
                onChange={(e) => setEditForm(prev => ({ ...prev, logo_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateClient}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
