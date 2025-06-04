
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useAdvertisementForm } from './advertisement-form/useAdvertisementForm';
import { AdvertisementFormFields } from './advertisement-form/AdvertisementFormFields';

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
  const {
    form,
    isSubmitting,
    selectedClients,
    setSelectedClients,
    clientSelectorRef,
    onSubmit
  } = useAdvertisementForm({
    advertisementId,
    open,
    onAdvertisementCreated,
    onOpenChange
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {advertisementId ? 'Editar Anúncio' : 'Novo Anúncio'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AdvertisementFormFields
              form={form}
              selectedClients={selectedClients}
              onClientChange={setSelectedClients}
              clientSelectorRef={clientSelectorRef}
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
