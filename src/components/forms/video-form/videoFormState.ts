
import { useState } from 'react';
import { VideoFormData } from './VideoFormTypes';

export const useVideoFormState = () => {
  const [formData, setFormData] = useState<VideoFormData>({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    selectedCategories: [],
    selectedClients: [],
    publishDateTime: new Date() // Inicializa com data/hora atual
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

  const handleDateTimeChange = (publishDateTime: Date) => {
    console.log('=== DATA/HORA DE PUBLICAÇÃO ALTERADA ===');
    console.log('Nova data/hora:', publishDateTime);
    setFormData(prev => ({
      ...prev,
      publishDateTime
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      selectedCategories: [],
      selectedClients: [],
      publishDateTime: new Date() // Reinicia com data/hora atual
    });
  };

  return {
    formData,
    isLoading,
    setIsLoading,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    resetForm
  };
};
