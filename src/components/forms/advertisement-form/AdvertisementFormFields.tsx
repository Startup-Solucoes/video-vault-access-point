
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { AdvertisementFormData } from './advertisementFormValidation';
import { ClientSelector, ClientSelectorRef } from '../ClientSelector';

interface AdvertisementFormFieldsProps {
  form: UseFormReturn<AdvertisementFormData>;
  selectedClients: string[];
  onClientChange: (clients: string[]) => void;
  clientSelectorRef: React.RefObject<ClientSelectorRef>;
}

export const AdvertisementFormFields = ({
  form,
  selectedClients,
  onClientChange,
  clientSelectorRef
}: AdvertisementFormFieldsProps) => {
  return (
    <>
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

      <div className="space-y-2">
        <FormLabel>Clientes que verão o anúncio</FormLabel>
        <p className="text-sm text-gray-600">
          Se nenhum cliente for selecionado, o anúncio será global (visível para todos)
        </p>
        <ClientSelector
          ref={clientSelectorRef}
          selectedClients={selectedClients}
          onClientChange={onClientChange}
        />
      </div>

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
    </>
  );
};
