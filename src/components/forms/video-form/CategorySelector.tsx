
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { categories } from './VideoFormTypes';

interface CategorySelectorProps {
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  onCategoryChange
}) => {
  console.log('🏷️ CategorySelector - Categorias selecionadas:', selectedCategories);

  return (
    <div className="space-y-2">
      <Label>Categorias da Vídeo Aula</Label>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => {
          const isChecked = selectedCategories.includes(category);
          console.log(`📋 Categoria ${category} - Selecionada: ${isChecked}`);
          
          return (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={isChecked}
                onCheckedChange={(checked) => {
                  console.log(`🔄 Mudando categoria ${category} para: ${checked}`);
                  onCategoryChange(category, checked as boolean);
                }}
              />
              <Label htmlFor={category} className="text-sm">
                {category}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
