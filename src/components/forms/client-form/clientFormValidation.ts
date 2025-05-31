
import { z } from 'zod';
import { SecurityValidator } from '@/utils/security';
import { toast } from '@/hooks/use-toast';

// Custom validator functions
const emailValidator = (email: string) => {
  const validation = SecurityValidator.validateEmail(email);
  return validation.isValid;
};

const imageUrlValidator = (url: string) => {
  if (!url) return true; // Optional field
  const validation = SecurityValidator.validateImageUrl(url);
  return validation.isValid;
};

export const clientFormSchema = z.object({
  full_name: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .transform((val) => SecurityValidator.sanitizeText(val)),
  
  email: z.string()
    .min(1, "Email é obrigatório")
    .refine(emailValidator, {
      message: "Email deve ter um formato válido"
    }),
  
  logo_url: z.string()
    .optional()
    .refine(imageUrlValidator, {
      message: "URL do logo deve ser HTTPS e ter formato de imagem válido"
    }),

  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres"),

  confirmPassword: z.string()
    .min(1, "Confirmação de senha é obrigatória")
});

// Updated interface to match form usage
export interface ClientFormData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  logo_url: string;
}

// Validation function for the form
export const validateClientForm = (formData: ClientFormData): boolean => {
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

  if (!formData.password.trim()) {
    toast({
      title: "Erro",
      description: "Senha é obrigatória",
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

  return true;
};
