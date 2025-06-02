
import { toast } from '@/hooks/use-toast';

export interface ClientFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'admin' | 'client';
}

export const validateClientForm = (formData: ClientFormData): boolean => {
  // Validação do nome
  if (!formData.full_name.trim()) {
    toast({
      title: "Erro de validação",
      description: "Nome é obrigatório",
      variant: "destructive"
    });
    return false;
  }

  // Validação do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !emailRegex.test(formData.email)) {
    toast({
      title: "Erro de validação",
      description: "Email inválido",
      variant: "destructive"
    });
    return false;
  }

  // Validação da senha
  if (!formData.password || formData.password.length < 8) {
    toast({
      title: "Erro de validação",
      description: "Senha deve ter pelo menos 8 caracteres",
      variant: "destructive"
    });
    return false;
  }

  // Validação da confirmação de senha
  if (formData.password !== formData.confirmPassword) {
    toast({
      title: "Erro de validação",
      description: "Senhas não coincidem",
      variant: "destructive"
    });
    return false;
  }

  // Validação do tipo de usuário
  if (!formData.userType || !['admin', 'client'].includes(formData.userType)) {
    toast({
      title: "Erro de validação",
      description: "Tipo de usuário é obrigatório",
      variant: "destructive"
    });
    return false;
  }

  return true;
};
