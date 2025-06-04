
import * as z from 'zod';

export const advertisementSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  image_url: z.string().url('URL da imagem deve ser válida').optional().or(z.literal('')),
  link_url: z.string().url('URL do link deve ser válida'),
  is_active: z.boolean(),
  client_ids: z.array(z.string()).optional(),
});

export type AdvertisementFormData = z.infer<typeof advertisementSchema>;
