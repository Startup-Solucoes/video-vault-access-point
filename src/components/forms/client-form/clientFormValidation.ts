
import { toast } from '@/hooks/use-toast';

export interface ClientFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const validateClientForm = (formData: ClientFormData): boolean => {
  if (!formData.full_name.trim()) {
    toast({
      title: "Erro",
      description: "Nome do cliente é obrigatório",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.email.trim()) {
    toast({
      title: "Erro",
      description: "E-mail é obrigatório",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.password.trim()) {
    toast({
      title: "Erro",
      description: "Senha é obrigatória",
      variant: "destructive"
    });
    return false;
  }

  if (formData.password.length < 6) {
    toast({
      title: "Erro",
      description: "A senha deve ter pelo menos 6 caracteres",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.confirmPassword.trim()) {
    toast({
      title: "Erro",
      description: "Confirmação de senha é obrigatória",
      variant: "destructive"
    });
    return false;
  }

  if (formData.password !== formData.confirmPassword) {
    toast({
      title: "Erro",
      description: "As senhas não coincidem. Verifique e tente novamente.",
      variant: "destructive"
    });
    return false;
  }

  return true;
};
