
import { z } from 'zod';
import { SecurityValidator } from '@/utils/security';

// Custom validator functions using our security utility
const videoUrlValidator = (url: string) => {
  const validation = SecurityValidator.validateVideoUrl(url);
  return validation.isValid;
};

const sanitizedString = z.string().transform((val) => SecurityValidator.sanitizeText(val));

export const videoFormSchema = z.object({
  title: sanitizedString
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres"),
  
  description: sanitizedString
    .max(2000, "Descrição deve ter no máximo 2000 caracteres")
    .optional(),
  
  video_url: z.string()
    .min(1, "URL do vídeo é obrigatória")
    .refine(videoUrlValidator, {
      message: "URL do vídeo deve ser de um domínio permitido (YouTube, Vimeo, etc.) e usar HTTPS"
    }),
  
  thumbnail_url: z.string()
    .optional()
    .refine((url) => {
      if (!url) return true;
      const validation = SecurityValidator.validateImageUrl(url);
      return validation.isValid;
    }, {
      message: "URL da thumbnail deve ser HTTPS e ter formato de imagem válido"
    }),
  
  category: sanitizedString
    .max(100, "Categoria deve ter no máximo 100 caracteres")
    .optional(),
  
  platform: sanitizedString
    .max(50, "Plataforma deve ter no máximo 50 caracteres")
    .optional(),
  
  selectedClients: z.array(z.string()).min(1, "Selecione pelo menos um cliente"),
  
  publishDateTime: z.date().optional()
});

export type VideoFormData = z.infer<typeof videoFormSchema>;
