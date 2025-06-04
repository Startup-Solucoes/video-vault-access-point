
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { User, Users, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  full_name: string;
  email: string;
  logo_url?: string;
}

interface AdvertisementPermissionsDialogProps {
  advertisementId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionsUpdated: () => void;
}

export const AdvertisementPermissionsDialog = ({
  advertisementId,
  open,
  onOpenChange,
  onPermissionsUpdated
}: AdvertisementPermissionsDialogProps) => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    if (open && advertisementId) {
      fetchData();
    }
  }, [open, advertisementId]);

  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Buscar todos os clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('profiles')
        .select('id, full_name, email, logo_url')
        .eq('role', 'client')
        .eq('is_deleted', false)
        .order('full_name');

      if (clientsError) {
        console.error('Erro ao buscar clientes:', clientsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar clientes",
          variant: "destructive",
        });
        return;
      }

      // Buscar permissões existentes para este anúncio
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('advertisement_permissions')
        .select('client_id')
        .eq('advertisement_id', advertisementId);

      if (permissionsError) {
        console.error('Erro ao buscar permissões:', permissionsError);
        toast({
          title: "Erro",
          description: "Erro ao carregar permissões",
          variant: "destructive",
        });
        return;
      }

      setClients(clientsData || []);
      
      // Se não há permissões específicas, é um anúncio global
      if (!permissionsData || permissionsData.length === 0) {
        setIsGlobal(true);
        setSelectedClients([]);
      } else {
        setIsGlobal(false);
        setSelectedClients(permissionsData.filter(p => p.client_id).map(p => p.client_id!));
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientToggle = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients(prev => [...prev, clientId]);
    } else {
      setSelectedClients(prev => prev.filter(id => id !== clientId));
    }
  };

  const handleGlobalToggle = (checked: boolean) => {
    setIsGlobal(checked);
    if (checked) {
      setSelectedClients([]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log('💾 Salvando permissões:', { advertisementId, isGlobal, selectedClients });

    try {
      // Primeiro, remover todas as permissões existentes
      const { error: deleteError } = await supabase
        .from('advertisement_permissions')
        .delete()
        .eq('advertisement_id', advertisementId);

      if (deleteError) {
        console.error('Erro ao remover permissões existentes:', deleteError);
        throw deleteError;
      }

      // Se não é global, adicionar permissões específicas
      if (!isGlobal && selectedClients.length > 0) {
        const permissions = selectedClients.map(clientId => ({
          advertisement_id: advertisementId,
          client_id: clientId
        }));

        const { error: insertError } = await supabase
          .from('advertisement_permissions')
          .insert(permissions);

        if (insertError) {
          console.error('Erro ao inserir novas permissões:', insertError);
          throw insertError;
        }
      }

      console.log('✅ Permissões salvas com sucesso');
      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso",
      });

      onPermissionsUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('💥 Erro ao salvar permissões:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar permissões",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões do Anúncio</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Opção Global */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="global"
                      checked={isGlobal}
                      onCheckedChange={handleGlobalToggle}
                    />
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <label htmlFor="global" className="font-medium cursor-pointer">
                          Anúncio Global
                        </label>
                        <p className="text-sm text-gray-600">
                          Exibir para todos os clientes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Clientes */}
              {!isGlobal && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Selecionar Clientes Específicos
                  </h4>
                  
                  {clients.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum cliente encontrado
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {clients.map((client) => (
                        <Card key={client.id}>
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={client.id}
                                checked={selectedClients.includes(client.id)}
                                onCheckedChange={(checked) => 
                                  handleClientToggle(client.id, checked as boolean)
                                }
                              />
                              <div className="flex items-center space-x-3 flex-1">
                                {client.logo_url ? (
                                  <img 
                                    src={client.logo_url} 
                                    alt={`Logo ${client.full_name}`}
                                    className="h-8 w-8 object-contain rounded"
                                  />
                                ) : (
                                  <User className="h-8 w-8 text-gray-400" />
                                )}
                                <div>
                                  <label 
                                    htmlFor={client.id} 
                                    className="font-medium cursor-pointer"
                                  >
                                    {client.full_name}
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    {client.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Resumo */}
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  {isGlobal ? (
                    <Badge variant="default">
                      <Globe className="h-3 w-3 mr-1" />
                      Global - Todos os clientes
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {selectedClients.length} cliente(s) selecionado(s)
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
