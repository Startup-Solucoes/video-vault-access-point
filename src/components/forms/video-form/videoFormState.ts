
import { useState } from 'react';
import { VideoFormData } from './VideoFormTypes';

export const useVideoFormState = () => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    selectedCategories: [],
    selectedClients: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = (field: keyof VideoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    console.log('=== CATEGORIA ALTERADA ===');
    console.log('Categoria:', category, 'Checked:', checked);
    setFormData(prev => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter(c => c !== category)
    }));
  };

  const handleClientChange = (clientIds: string[]) => {
    console.log('=== CLIENTES SELECIONADOS ALTERADOS ===');
    console.log('Nova lista de clientes:', clientIds);
    setFormData(prev => ({
      ...prev,
      selectedClients: clientIds
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      selectedCategories: [],
      selectedClients: []
    });
  };

  return {
    formData,
    isLoading,
    setIsLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    resetForm
  };
};
