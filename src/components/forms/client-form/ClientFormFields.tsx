
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PasswordInput } from '@/components/ui/password-input';
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
        <Label htmlFor="user-type">Tipo de Usuário *</Label>
        <Select 
          value={formData.userType} 
          onValueChange={(value: 'admin' | 'client') => handleInputChange('userType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de usuário" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Cliente</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-name">
          {formData.userType === 'admin' ? 'Nome do Administrador' : 'Nome do Cliente'} *
        </Label>
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
          placeholder="usuario@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-password">Senha * (mínimo 8 caracteres)</Label>
        <PasswordInput
          id="client-password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          showGenerator={true}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-confirm-password">Confirmar Senha *</Label>
        <PasswordInput
          id="client-confirm-password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          showGenerator={false}
          showStrengthIndicator={false}
          required
        />
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
        )}
        {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 8 && (
          <p className="text-sm text-green-600 mt-1">✓ Senhas coincidem</p>
        )}
      </div>
    </>
  );
};
