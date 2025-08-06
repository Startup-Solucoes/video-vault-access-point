
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { ClientFormData, validateClientForm } from './clientFormValidation';
import { createUser, getErrorMessage } from './userCreationService';

export const useClientForm = (onClientCreated?: () => void, onOpenChange?: (open: boolean) => void) => {
  const [formData, setFormData] = useState<ClientFormData>({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'client'
    });
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleLogoChange = (file: File | null, preview: string | null) => {
    setLogoFile(file);
    setLogoPreview(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateClientForm(formData)) {
      return;
    }

    setIsLoading(true);

    try {
      await createUser({ formData, logoFile });
      
      // Resetar formulário
      resetForm();
      
      // Fechar modal
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      // Aguardar um pouco e chamar callback para atualizar lista
      if (onClientCreated) {
        console.log('Chamando callback para atualizar lista...');
        // Aguardar para garantir que o banco sincronizou com a logo
        setTimeout(() => {
          onClientCreated();
        }, 1500);
      }
    } catch (error: any) {
      console.error('=== ERRO NO CADASTRO ===');
      console.error('Erro completo:', error);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    logoFile,
    logoPreview,
    isLoading,
    handleSubmit,
    handleLogoChange
  };
};
