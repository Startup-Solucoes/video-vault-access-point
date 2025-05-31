
import { z } from 'zod';
import { SecurityValidator } from '@/utils/security';

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

const sanitizedString = z.string().transform((val) => SecurityValidator.sanitizeText(val));

export const clientFormSchema = z.object({
  full_name: sanitizedString
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  email: z.string()
    .min(1, "Email é obrigatório")
    .refine(emailValidator, {
      message: "Email deve ter um formato válido"
    }),
  
  logo_url: z.string()
    .optional()
    .refine(imageUrlValidator, {
      message: "URL do logo deve ser HTTPS e ter formato de imagem válido"
    })
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
