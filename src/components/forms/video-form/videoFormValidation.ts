
import { toast } from '@/hooks/use-toast';
import { VideoFormData } from './VideoFormTypes';

export const validateVideoForm = (formData: VideoFormData, user: any): boolean => {
  console.log('=== VALIDANDO FORMULÁRIO ===');
  console.log('Dados do formulário:', formData);
  console.log('Usuário logado:', user);

  if (!user) {
    console.error('❌ ERRO: Usuário não logado');
    toast({
      title: "Erro",
      description: "Você precisa estar logado para cadastrar vídeos",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.title.trim()) {
    console.error('❌ ERRO: Título não preenchido');
    toast({
      title: "Erro",
      description: "O título é obrigatório",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.video_url.trim()) {
    console.error('❌ ERRO: URL do vídeo não preenchida');
    toast({
      title: "Erro",
      description: "A URL do vídeo é obrigatória",
      variant: "destructive"
    });
    return false;
  }

  return true;
};
