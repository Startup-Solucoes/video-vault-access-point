
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClientFormData, validateClientForm } from './clientFormValidation';

const initialFormData: ClientFormData = {
  full_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  logo_url: ''
};

export const useClientForm = (onClientCreated?: () => void, onOpenChange?: (open: boolean) => void) => {
  const [formData, setFormData] = useState<ClientFormData>(initialFormData);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      // Implementar lógica de criação do cliente
      console.log('Creating client:', formData);
      
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
      
      // Reset form
      setFormData(initialFormData);
      setLogoFile(null);
      setLogoPreview(null);
      
      if (onClientCreated) {
        onClientCreated();
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
      
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar cliente. Tente novamente.",
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
    isSubmitting: isLoading,
    handleSubmit,
    handleLogoChange
  };
};
