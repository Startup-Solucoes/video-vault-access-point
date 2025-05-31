
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VideoFormData } from './VideoFormTypes';

const initialFormData: VideoFormData = {
  title: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
  selectedCategories: [],
  selectedClients: [],
  publishDateTime: new Date(),
  platform: 'outros'
};

export const useVideoForm = (onClose?: () => void) => {
  const [formData, setFormData] = useState<VideoFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFieldChange = (field: keyof VideoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => {
      const newCategories = checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter(c => c !== category);
      
      return {
        ...prev,
        selectedCategories: newCategories
      };
    });
  };

  const handleClientChange = (clientIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedClients: clientIds
    }));
  };

  const handleDateTimeChange = (publishDateTime: Date) => {
    setFormData(prev => ({
      ...prev,
      publishDateTime
    }));
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platform
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Implementar lógica de submissão do vídeo
      console.log('Submitting video:', formData);
      
      toast({
        title: "Sucesso",
        description: "Vídeo criado com sucesso!",
      });

      // Reset form
      setFormData(initialFormData);
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error submitting video:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar vídeo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isSubmitting: isLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange,
    handleSubmit
  };
};
