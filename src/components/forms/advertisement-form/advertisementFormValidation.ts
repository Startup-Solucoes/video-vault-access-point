
import * as z from 'zod';

export const advertisementSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  image_url: z.string().url('URL da imagem deve ser válida').optional().or(z.literal('')),
  link_url: z.string().url('URL do link deve ser válida'),
  price: z.string().optional().refine((val) => {
    if (!val || val === '') return true;
    const num = parseFloat(val.replace(',', '.'));
    return !isNaN(num) && num >= 0;
  }, 'Preço deve ser um valor válido'),
  is_active: z.boolean(),
  client_ids: z.array(z.string()).optional(),
});

export type AdvertisementFormData = z.infer<typeof advertisementSchema>;
