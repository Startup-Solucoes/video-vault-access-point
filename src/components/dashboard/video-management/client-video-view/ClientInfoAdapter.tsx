import React from 'react';
import { EditClientDialog } from '../../client-management/EditClientDialog';
import { Client, EditClientForm } from '@/types/client';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ClientInfoAdapterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
  onClientUpdated: (newName: string, newLogoUrl?: string) => void;
}

export const ClientInfoAdapter = ({
  open,
  onOpenChange,
  clientId,
  clientName,
  clientLogoUrl,
  onClientUpdated
}: ClientInfoAdapterProps) => {
  // Buscar dados completos do cliente para obter o email
  const { data: clientData } = useQuery({
    queryKey: ['client-data', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('email, full_name, logo_url')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Erro ao buscar dados do cliente:', error);
        throw error;
      }

      return data;
    },
    enabled: !!clientId && open,
  });

  // Converter para o formato esperado pelo EditClientDialog
  const client: Client = {
    id: clientId,
    email: clientData?.email || '',
    full_name: clientData?.full_name || clientName,
    logo_url: clientData?.logo_url || clientLogoUrl,
    role: 'client',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_sign_in_at: undefined,
    is_deleted: false
  };

  const handleSave = async (clientId: string, editForm: EditClientForm) => {
    // Adaptar o callback para o formato esperado
    onClientUpdated(editForm.full_name, editForm.logo_url || undefined);
  };

  // Só renderizar quando temos os dados do cliente
  if (!clientData && open) {
    return null;
  }

  return (
    <EditClientDialog
      open={open}
      onOpenChange={onOpenChange}
      client={client}
      onSave={handleSave}
    />
  );
};