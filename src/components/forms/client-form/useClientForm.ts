
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ClientFormData } from './clientFormValidation';

export const useClientForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: ClientFormData) => {
    setIsSubmitting(true);
    
    try {
      // Validar dados básicos
      if (!formData.full_name.trim()) {
        toast({
          title: "Erro",
          description: "Nome é obrigatório",
          variant: "destructive"
        });
        return false;
      }

      if (!formData.email.trim()) {
        toast({
          title: "Erro",
          description: "Email é obrigatório",
          variant: "destructive"
        });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive"
        });
        return false;
      }

      if (formData.password.length < 8) {
        toast({
          title: "Erro",
          description: "Senha deve ter pelo menos 8 caracteres",
          variant: "destructive"
        });
        return false;
      }

      // Implementar lógica de criação do cliente
      console.log('Creating client:', formData);
      
      toast({
        title: "Sucesso",
        description: "Cliente criado com sucesso!",
      });
      
      return true;
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar cliente. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
