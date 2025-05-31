
import { useState, useCallback } from 'react';
import { EditVideoFormData } from './EditVideoFormTypes';

const initialFormData: EditVideoFormData = {
  title: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
  selectedCategories: [],
  selectedClients: [],
  publishDateTime: new Date(),
  platform: 'outros'
};

export const useEditVideoFormState = () => {
  const [formData, setFormData] = useState<EditVideoFormData>(initialFormData);

  const handleFieldChange = useCallback((field: keyof EditVideoFormData, value: string) => {
    console.log(`🔄 Alterando campo ${field} para:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    console.log(`🔄 Alterando categoria ${category} para: ${checked}`);
    setFormData(prev => {
      const newCategories = checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter(c => c !== category);
      
      console.log('📋 Novas categorias:', newCategories);
      return {
        ...prev,
        selectedCategories: newCategories
      };
    });
  }, []);

  const handleClientChange = useCallback((clientIds: string[]) => {
    console.log('🔄 Alterando clientes para:', clientIds);
    setFormData(prev => ({
      ...prev,
      selectedClients: clientIds
    }));
  }, []);

  const handleDateTimeChange = useCallback((publishDateTime: Date) => {
    console.log('🔄 Alterando data para:', publishDateTime);
    setFormData(prev => ({
      ...prev,
      publishDateTime
    }));
  }, []);

  const handlePlatformChange = useCallback((platform: string) => {
    console.log('🔄 Alterando plataforma para:', platform);
    setFormData(prev => ({
      ...prev,
      platform
    }));
  }, []);

  const updateFormData = useCallback((data: EditVideoFormData) => {
    console.log('🔄 Atualizando formData completo:', data);
    setFormData(data);
  }, []);

  return {
    formData,
    setFormData: updateFormData,
    handleFieldChange,
    handleCategoryChange,
    handleClientChange,
    handleDateTimeChange,
    handlePlatformChange
  };
};
