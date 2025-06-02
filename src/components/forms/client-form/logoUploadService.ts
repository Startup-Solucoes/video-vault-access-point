
import { supabase } from '@/integrations/supabase/client';

export const uploadClientLogo = async (file: File, userId: string): Promise<string | null> => {
  try {
    console.log('Iniciando upload da logo para usuário:', userId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('client-logos')
      .upload(fileName, file);

    if (error) {
      console.error('Erro no upload da logo:', error);
      throw error;
    }

    console.log('Logo enviada com sucesso:', data.path);

    const { data: { publicUrl } } = supabase.storage
      .from('client-logos')
      .getPublicUrl(fileName);

    console.log('URL pública da logo:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Erro ao fazer upload da logo:', error);
    return null;
  }
};
