
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

  // Carregar dados do vídeo
  useEffect(() => {
    const loadData = async () => {
      if (!videoId) return;

      try {
        const data = await loadVideoData(videoId);
        setFormData(data);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [videoId, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
