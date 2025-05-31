
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientFormData } from './clientFormValidation';

interface ClientFormFieldsProps {
  formData: ClientFormData;
  onFormDataChange: (data: ClientFormData) => void;
}

export const ClientFormFields = ({ formData, onFormDataChange }: ClientFormFieldsProps) => {
  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="client-name">Nome do Cliente *</Label>
        <Input
          id="client-name"
          value={formData.full_name}
          onChange={(e) => handleInputChange('full_name', e.target.value)}
          placeholder="Digite o nome completo"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-email">E-mail *</Label>
        <Input
          id="client-email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="cliente@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-password">Senha * (mínimo 6 caracteres)</Label>
        <Input
          id="client-password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="••••••••"
          minLength={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-confirm-password">Confirmar Senha *</Label>
        <Input
          id="client-confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          placeholder="••••••••"
          minLength={6}
          required
        />
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-sm text-red-500">As senhas não coincidem</p>
        )}
      </div>
    </>
  );
};
