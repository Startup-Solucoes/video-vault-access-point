
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ClientVideoAssignmentProps {
  selectedVideos: string[];
  onSuccess: () => void;
}

export const useClientVideoAssignment = ({ 
  selectedVideos, 
  onSuccess 
}: ClientVideoAssignmentProps) => {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleBulkClientChange = (clientIds: string[]) => {
    setSelectedClients(clientIds);
  };

  const handleAssignToClients = async () => {
    console.log('=== INICIANDO ATRIBUIÇÃO ===');
    console.log('Vídeos selecionados:', selectedVideos);
    console.log('Clientes selecionados:', selectedClients);
    
    if (selectedVideos.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um vídeo",
        variant: "destructive"
      });
      return;
    }

    if (selectedClients.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um cliente",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Usuário autenticado:', user.id);

      // Verificar permissões já existentes para evitar duplicatas
      const { data: existingPermissions, error: checkError } = await supabase
        .from('video_permissions')
        .select('video_id, client_id')
        .in('video_id', selectedVideos)
        .in('client_id', selectedClients);

      if (checkError) {
        console.error('Erro ao verificar permissões existentes:', checkError);
        throw checkError;
      }

      console.log('Permissões existentes:', existingPermissions);

      // Obter próximo display_order para cada cliente
      const clientOrderPromises = selectedClients.map(async (clientId) => {
        const { data: lastOrder } = await supabase
          .from('video_permissions')
          .select('display_order')
          .eq('client_id', clientId)
          .order('display_order', { ascending: false })
          .limit(1);
        
        return {
          clientId,
          nextOrder: (lastOrder?.[0]?.display_order || 0) + 1
        };
      });

      const clientOrders = await Promise.all(clientOrderPromises);
      const orderMap = Object.fromEntries(
        clientOrders.map(co => [co.clientId, co.nextOrder])
      );

      // Criar lista de novas permissões (evitando duplicatas)
      const newPermissions = [];
      for (const videoId of selectedVideos) {
        for (const clientId of selectedClients) {
          const exists = existingPermissions?.some(
            p => p.video_id === videoId && p.client_id === clientId
          );
          if (!exists) {
            newPermissions.push({
              video_id: videoId,
              client_id: clientId,
              granted_by: user.id,
              display_order: orderMap[clientId]++
            });
          }
        }
      }

      console.log('Novas permissões a serem inseridas:', newPermissions);

      if (newPermissions.length === 0) {
        toast({
          title: "Aviso",
          description: "Todos os vídeos selecionados já estão atribuídos aos clientes escolhidos",
        });
        setIsAssigning(false);
        return;
      }

      const { error } = await supabase
        .from('video_permissions')
        .insert(newPermissions);

      if (error) {
        console.error('Erro ao inserir permissões:', error);
        throw error;
      }

      console.log('✅ Permissões inseridas com sucesso');

      toast({
        title: "Sucesso",
        description: `${selectedVideos.length} vídeo(s) atribuído(s) para ${selectedClients.length} cliente(s)`,
      });

      // Limpar seleções e chamar callback de sucesso
      setSelectedClients([]);
      onSuccess();

    } catch (error) {
      console.error('Erro ao atribuir vídeos:', error);
      toast({
        title: "Erro",
        description: "Erro ao atribuir vídeos aos clientes",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    selectedClients,
    setSelectedClients,
    isAssigning,
    handleClientToggle,
    handleBulkClientChange,
    handleAssignToClients
  };
};
