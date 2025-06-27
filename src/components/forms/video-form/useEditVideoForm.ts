
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { validateEditVideoForm } from './editVideoValidation';
import { submitEditVideoData } from './editVideoSubmissionService';
import { loadVideoData } from './editVideoDataService';
import { useEditVideoFormState } from './useEditVideoFormState';
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation';

export const useEditVideoForm = (videoId: string, onClose: () => void) => {
  const { user } = useAuth();
  const { invalidateVideoCache } = useCacheInvalidation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const isDataLoadedRef = useRef(false);
  
  const {
    formData,
    setFormData,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange
  } = useEditVideoFormState();

  // Função para carregar dados apenas uma vez
  const loadVideoDataOnce = useCallback(async () => {
    if (!videoId || isDataLoadedRef.current) return;

    console.log('🔄 Carregando dados do vídeo:', videoId);
    setIsLoadingData(true);
    
    try {
      const data = await loadVideoData(videoId);
      console.log('✅ Dados carregados:', data);
      setFormData(data);
      isDataLoadedRef.current = true;
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [videoId, setFormData]);

  // Carregar dados apenas uma vez quando o modal abrir
  useEffect(() => {
    if (videoId) {
      isDataLoadedRef.current = false;
      loadVideoDataOnce();
    }
  }, [videoId, loadVideoDataOnce]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Dados do formulário no submit:', formData);
    
    if (!validateEditVideoForm(formData, user)) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await submitEditVideoData(formData, videoId, user);
      
      if (success) {
        // Invalidar cache após edição bem-sucedida
        invalidateVideoCache();
        onClose();
      }
      
    } finally {
      setIsLoading(false);
    }
  }, [formData, user, videoId, invalidateVideoCache, onClose]);

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
