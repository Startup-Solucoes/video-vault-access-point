
import React, { useState } from 'react';
import { AdvertisementWithPermissions } from '@/types/advertisement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdvertisementPermissionsDialog } from './AdvertisementPermissionsDialog';
import { AdvertisementCard } from './AdvertisementCard';
import { LoadingState, EmptyState } from './AdvertisementListStates';

interface AdvertisementListProps {
  advertisements: AdvertisementWithPermissions[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

export const AdvertisementList = ({ 
  advertisements, 
  isLoading, 
  onEdit, 
  onRefresh 
}: AdvertisementListProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [permissionsDialogId, setPermissionsDialogId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    console.log('🗑️ Deletando anúncio:', { id, title });

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao deletar anúncio:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar anúncio",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Anúncio deletado com sucesso');
      toast({
        title: "Sucesso",
        description: `Anúncio "${title}" deletado com sucesso`,
      });

      onRefresh();
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao deletar anúncio",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao alterar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao alterar status do anúncio",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Anúncio ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });

      onRefresh();
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao alterar status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (advertisements.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((ad) => (
          <AdvertisementCard
            key={ad.id}
            advertisement={ad}
            onEdit={onEdit}
            onDelete={handleDelete}
            onToggleActive={toggleActive}
            onManagePermissions={setPermissionsDialogId}
            isDeleting={deletingId === ad.id}
          />
        ))}
      </div>

      {permissionsDialogId && (
        <AdvertisementPermissionsDialog
          advertisementId={permissionsDialogId}
          open={!!permissionsDialogId}
          onOpenChange={(open) => !open && setPermissionsDialogId(null)}
          onPermissionsUpdated={onRefresh}
        />
      )}
    </>
  );
};
