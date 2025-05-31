
import { useAuth } from '@/hooks/useAuth';
import { useVideoFormState } from './videoFormState';
import { validateVideoForm } from './videoFormValidation';
import { submitVideoData } from './videoSubmissionService';

export const useVideoForm = (onClose: () => void) => {
  const { user } = useAuth();
  const {
    formData,
    isLoading,
    setIsLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    resetForm
  } = useVideoFormState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== INICIANDO PROCESSO DE CADASTRO DE VÍDEO ===');

    if (!validateVideoForm(formData, user)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await submitVideoData(formData, user);
      
      if (success) {
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
    handleSubmit,
    resetForm
  };
};
