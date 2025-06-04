
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const advertisementSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  image_url: z.string().url('URL da imagem deve ser válida').optional().or(z.literal('')),
  link_url: z.string().url('URL do link deve ser válida'),
  is_active: z.boolean(),
});

type AdvertisementFormData = z.infer<typeof advertisementSchema>;

interface AdvertisementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertisementId?: string;
  onAdvertisementCreated?: () => void;
}

export const AdvertisementForm = ({ 
  open, 
  onOpenChange, 
  advertisementId, 
  onAdvertisementCreated 
}: AdvertisementFormProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdvertisementFormData>({
    resolver: zodResolver(advertisementSchema),
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      is_active: true,
    },
  });

  // Carregar dados do anúncio se estiver editando
  useEffect(() => {
    if (advertisementId && open) {
      const fetchAdvertisement = async () => {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('id', advertisementId)
          .single();

        if (error) {
          console.error('Erro ao carregar anúncio:', error);
          return;
        }

        form.reset({
          title: data.title,
          description: data.description || '',
          image_url: data.image_url || '',
          link_url: data.link_url,
          is_active: data.is_active,
        });
      };

      fetchAdvertisement();
    } else if (open && !advertisementId) {
      form.reset({
        title: '',
        description: '',
        image_url: '',
        link_url: '',
        is_active: true,
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

      if (advertisementId) {
        // Editando anúncio existente
        const { error } = await supabase
          .from('advertisements')
          .update(advertisementData)
          .eq('id', advertisementId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Anúncio atualizado com sucesso",
        });
      } else {
        // Criando novo anúncio
        const { error } = await supabase
          .from('advertisements')
          .insert([advertisementData]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Anúncio criado com sucesso",
        });
      }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {advertisementId ? 'Editar Anúncio' : 'Novo Anúncio'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o título do anúncio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite a descrição do anúncio"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Link *</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Anúncio Ativo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Anúncio será exibido para os clientes
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : (advertisementId ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
