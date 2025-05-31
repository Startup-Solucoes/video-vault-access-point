
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { validateEditVideoForm } from './editVideoValidation';
import { submitEditVideoData } from './editVideoSubmissionService';
import { loadVideoData } from './editVideoDataService';
import { useEditVideoFormState } from './useEditVideoFormState';

export const useEditVideoForm = (videoId: string, onClose: () => void) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const {
    formData,
    setFormData,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange
  } = useEditVideoFormState();

  // Carregar dados do vídeo apenas uma vez
  useEffect(() => {
    const loadData = async () => {
      if (!videoId) return;

      try {
        console.log('🔄 Carregando dados do vídeo:', videoId);
        const data = await loadVideoData(videoId);
        console.log('✅ Dados carregados:', data);
        console.log('🔄 Inicializando formData com dados carregados');
        setFormData(data);
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [videoId, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Dados do formulário no submit:', formData);
    
    if (!validateEditVideoForm(formData, user)) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await submitEditVideoData(formData, videoId, user);
      
      if (success) {
        onClose();
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    isLoadingData,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange,
    handleSubmit
  };
};
