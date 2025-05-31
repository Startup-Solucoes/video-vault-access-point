
import { useState } from 'react';
import { EditVideoFormData } from './EditVideoFormTypes';

export const useEditVideoFormState = (initialData?: EditVideoFormData) => {
  const [formData, setFormData] = useState<EditVideoFormData>(
    initialData || {
      title: '',
      description: '',
      video_url: '',
      thumbnail_url: '',
      selectedCategories: [],
      selectedClients: [],
      publishDateTime: new Date(),
      platform: 'outros'
    }
  );

  const handleFieldChange = (field: keyof EditVideoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter(c => c !== category)
    }));
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

  const updateFormData = (data: EditVideoFormData) => {
    setFormData(data);
  };

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
