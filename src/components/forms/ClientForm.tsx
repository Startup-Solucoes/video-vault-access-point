
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ClientFormFields } from './client-form/ClientFormFields';
import { ClientLogoUpload } from './client-form/ClientLogoUpload';
import { useClientForm } from './client-form/useClientForm';

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientCreated?: () => void;
}

export const ClientForm = ({ open, onOpenChange, onClientCreated }: ClientFormProps) => {
  const {
    formData,
    setFormData,
    logoFile,
    logoPreview,
    isLoading,
    handleSubmit,
    handleLogoChange
  } = useClientForm(onClientCreated, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <ClientFormFields 
            formData={formData} 
            onFormDataChange={setFormData} 
          />
          
          <ClientLogoUpload
            logoFile={logoFile}
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
