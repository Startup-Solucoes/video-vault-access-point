
import { z } from 'zod';
import { SecurityValidator } from '@/utils/security';
import { toast } from '@/hooks/use-toast';

// Custom validator functions using our security utility
const videoUrlValidator = (url: string) => {
  const validation = SecurityValidator.validateVideoUrl(url);
  return validation.isValid;
};

export const videoFormSchema = z.object({
  title: z.string()
    .min(1, "Título é obrigatório")
    .max(200, "Título deve ter no máximo 200 caracteres")
    .transform((val) => SecurityValidator.sanitizeText(val)),
  
  description: z.string()
    .max(2000, "Descrição deve ter no máximo 2000 caracteres")
    .optional()
    .transform((val) => val ? SecurityValidator.sanitizeText(val) : val),
  
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
  
  category: z.string()
    .max(100, "Categoria deve ter no máximo 100 caracteres")
    .optional()
    .transform((val) => val ? SecurityValidator.sanitizeText(val) : val),
  
  platform: z.string()
    .max(50, "Plataforma deve ter no máximo 50 caracteres")
    .optional()
    .transform((val) => val ? SecurityValidator.sanitizeText(val) : val),
  
  selectedClients: z.array(z.string()).min(1, "Selecione pelo menos um cliente"),
  
  publishDateTime: z.date().optional()
});

export type VideoFormData = z.infer<typeof videoFormSchema>;

// Validation function for the form
export const validateVideoForm = (formData: any, user: any): boolean => {
  if (!user) {
    toast({
      title: "Erro",
      description: "Você precisa estar logado para cadastrar vídeos",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.title?.trim()) {
    toast({
      title: "Erro",
      description: "O título é obrigatório",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.video_url?.trim()) {
    toast({
      title: "Erro",
      description: "A URL do vídeo é obrigatória",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.selectedClients || formData.selectedClients.length === 0) {
    toast({
      title: "Erro",
      description: "Selecione pelo menos um cliente",
      variant: "destructive"
    });
    return false;
  }

  return true;
};
