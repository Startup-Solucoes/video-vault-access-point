import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryTextColor } from '@/utils/categoryColors';

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availableCategories: string[];
  videos: any[];
}

// Cores para cada categoria com destaque no background e texto
const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Gerais': 'text-blue-600',
    'Produto': 'text-green-600',
    'Financeiro': 'text-yellow-600',
    'Relatórios': 'text-purple-600',
    'Pedidos de venda': 'text-orange-600',
    'Fiscal': 'text-red-600',
    'Integrações': 'text-teal-600',
    'Serviços': 'text-indigo-600'
  };
  
  return colors[category] || 'text-gray-600';
};

export const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  videos
}: CategoryFilterProps) => {
  if (availableCategories.length === 0) {
    return null;
  }

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      setSelectedCategory('');
    } else {
      setSelectedCategory(value);
    }
  };

  const getDisplayValue = () => {
    if (selectedCategory === '') {
      return 'all';
    }
    return selectedCategory;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Filtrar por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={getDisplayValue()} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="font-medium">Todas as categorias ({videos.length})</span>
            </SelectItem>
            {availableCategories.map((category) => {
              const count = videos.filter(v => v.category === category).length;
              const categoryColor = getCategoryTextColor(category);
              
              return (
                <SelectItem key={category} value={category}>
                  <span className={`font-medium ${categoryColor}`}>
                    {category} ({count})
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
