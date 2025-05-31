
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VideoFormData } from './VideoFormTypes';

export const useVideoForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: VideoFormData, selectedClients: string[]) => {
    setIsSubmitting(true);
    
    try {
      // Implementar lógica de submissão do vídeo
      console.log('Submitting video:', formData, selectedClients);
      
      toast({
        title: "Sucesso",
        description: "Vídeo criado com sucesso!",
      });
    } catch (error) {
      console.error('Error submitting video:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar vídeo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
