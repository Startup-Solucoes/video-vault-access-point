
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Client, EditClientForm } from '@/types/client';
import { ClientUsersManager } from './ClientUsersManager';

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: (clientId: string, editForm: EditClientForm) => void;
}

export const EditClientDialog = ({ 
  open, 
  onOpenChange, 
  client, 
  onSave 
}: EditClientDialogProps) => {
  const [editForm, setEditForm] = useState<EditClientForm>({
    full_name: '',
    email: '',
    logo_url: ''
  });

  useEffect(() => {
    if (client) {
      setEditForm({
        full_name: client.full_name,
        email: client.email,
        logo_url: client.logo_url || ''
      });
    }
  }, [client]);

  const handleSave = () => {
    if (client) {
      onSave(client.id, editForm);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Client basic info */}
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
              <Label htmlFor="edit-email">Email Principal</Label>
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
          </div>

          <Separator />

          {/* Client users management */}
          {client && (
            <ClientUsersManager 
              clientId={client.id} 
              clientEmail={client.email}
              clientName={client.full_name}
            />
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
