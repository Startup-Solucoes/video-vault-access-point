
import { useAuth } from '@/hooks/useAuth';
import { useVideoFormState } from './videoFormState';
import { validateVideoForm } from './videoFormValidation';
import { submitVideoData } from './videoSubmissionService';
import { useCacheInvalidation } from '@/hooks/useCacheInvalidation';

export const useVideoForm = (onClose: () => void) => {
  const { user, profile } = useAuth();
  const { invalidateVideoCache } = useCacheInvalidation();
  const {
    formData,
    isLoading,
    setIsLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange,
    resetForm
  } = useVideoFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== INICIANDO PROCESSO DE CADASTRO DE VÍDEO ===');

    if (!validateVideoForm(formData, user, profile)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await submitVideoData(formData, user);
      
      if (success) {
        // Invalidar cache após criação bem-sucedida
        invalidateVideoCache();
        resetForm();
        onClose();
      }
      
    } finally {
      setIsLoading(false);
      console.log('🏁 === FINALIZANDO PROCESSO ===');
    }
  };

  return {
    formData,
    isLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange,
    handleSubmit,
    resetForm
  };
};
