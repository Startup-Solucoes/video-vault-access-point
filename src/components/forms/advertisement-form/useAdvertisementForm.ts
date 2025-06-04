
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { advertisementSchema, AdvertisementFormData } from './advertisementFormValidation';
import { ClientSelectorRef } from '../ClientSelector';

interface UseAdvertisementFormProps {
  advertisementId?: string;
  open: boolean;
  onAdvertisementCreated?: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useAdvertisementForm = ({
  advertisementId,
  open,
  onAdvertisementCreated,
  onOpenChange
}: UseAdvertisementFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const clientSelectorRef = useRef<ClientSelectorRef>(null);

  const form = useForm<AdvertisementFormData>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      is_active: true,
      client_ids: [],
    },
  });

  // Carregar dados do anúncio se estiver editando
  useEffect(() => {
    if (advertisementId && open) {
      const fetchAdvertisement = async () => {
        const { data, error } = await supabase
          .from('advertisements')
          .select(`
            *,
            advertisement_permissions (client_id)
          `)
          .eq('id', advertisementId)
          .single();

        if (error) {
          console.error('Erro ao carregar anúncio:', error);
          return;
        }

        const clientIds = data.advertisement_permissions
          ?.filter(p => p.client_id)
          .map(p => p.client_id) || [];

        setSelectedClients(clientIds);
        form.reset({
          title: data.title,
          description: data.description || '',
          image_url: data.image_url || '',
          link_url: data.link_url,
          is_active: data.is_active,
          client_ids: clientIds,
        });
      };

      fetchAdvertisement();
    } else if (open && !advertisementId) {
      setSelectedClients([]);
      form.reset({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        is_active: true,
        client_ids: [],
      });
    }
  }, [advertisementId, open, form]);

  const onSubmit = async (data: AdvertisementFormData) => {
    if (!profile) return;

    setIsSubmitting(true);
    console.log('📝 Salvando anúncio:', data);

    try {
      const advertisementData = {
        title: data.title,
        description: data.description || null,
        image_url: data.image_url || null,
        link_url: data.link_url,
        is_active: data.is_active,
        created_by: profile.id,
        updated_at: new Date().toISOString(),
      };

      let advertisementIdToUse = advertisementId;

      if (advertisementId) {
        // Editando anúncio existente
        const { error } = await supabase
          .from('advertisements')
          .update(advertisementData)
          .eq('id', advertisementId);

        if (error) throw error;
      } else {
        // Criando novo anúncio
        const { data: newAd, error } = await supabase
          .from('advertisements')
          .insert([advertisementData])
          .select()
          .single();

        if (error) throw error;
        advertisementIdToUse = newAd.id;
      }

      // Gerenciar permissões de clientes
      if (advertisementIdToUse) {
        // Remover permissões existentes
        await supabase
          .from('advertisement_permissions')
          .delete()
          .eq('advertisement_id', advertisementIdToUse);

        // Adicionar novas permissões se houver clientes selecionados
        if (selectedClients.length > 0) {
          const permissions = selectedClients.map(clientId => ({
            advertisement_id: advertisementIdToUse,
            client_id: clientId
          }));

          const { error: permError } = await supabase
            .from('advertisement_permissions')
            .insert(permissions);

          if (permError) throw permError;
        }
      }

      toast({
        title: "Sucesso",
        description: advertisementId ? "Anúncio atualizado com sucesso" : "Anúncio criado com sucesso",
      });

      onAdvertisementCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar anúncio:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar anúncio",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    selectedClients,
    setSelectedClients,
    clientSelectorRef,
    onSubmit
  };
};
