
import { toast } from '@/hooks/use-toast';
import { EditVideoFormData } from './EditVideoFormTypes';

export const validateEditVideoForm = (formData: EditVideoFormData, user: any, profile?: { role?: string } | null): boolean => {
  if (!user) {
    toast({
      title: "Erro",
      description: "Você precisa estar logado para editar vídeos",
      variant: "destructive"
    });
    return false;
  }

  // Verificar se o usuário é admin (via metadata ou perfil)
  const isAdmin = user?.user_metadata?.role === 'admin' || profile?.role === 'admin';
  if (!isAdmin) {
    toast({
      title: "Acesso Negado",
      description: "Apenas administradores podem editar vídeos",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.title.trim()) {
    toast({
      title: "Erro",
      description: "O título é obrigatório",
      variant: "destructive"
    });
    return false;
  }

  if (!formData.video_url.trim()) {
    toast({
      title: "Erro",
      description: "A URL do vídeo é obrigatória",
      variant: "destructive"
    });
    return false;
  }

  return true;
};
