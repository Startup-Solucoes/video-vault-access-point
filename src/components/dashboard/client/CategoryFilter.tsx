
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availableCategories: string[];
  videos: any[];
}

// Cores para cada categoria
const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Gerais': 'bg-blue-500 hover:bg-blue-600 border-blue-200',
    'Produto': 'bg-green-500 hover:bg-green-600 border-green-200',
    'Financeiro': 'bg-yellow-500 hover:bg-yellow-600 border-yellow-200',
    'Relatórios': 'bg-purple-500 hover:bg-purple-600 border-purple-200',
    'Pedidos de venda': 'bg-orange-500 hover:bg-orange-600 border-orange-200',
    'Fiscal': 'bg-red-500 hover:bg-red-600 border-red-200',
    'Integrações': 'bg-teal-500 hover:bg-teal-600 border-teal-200',
    'Serviços': 'bg-indigo-500 hover:bg-indigo-600 border-indigo-200'
  };
  
  // Cor padrão se a categoria não estiver mapeada
  return colors[category] || 'bg-gray-500 hover:bg-gray-600 border-gray-200';
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Categorias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Carousel className="w-full max-w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-auto">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedCategory('')}
                  className="whitespace-nowrap"
                >
                  Todas ({videos.length})
                </Button>
              </CarouselItem>
              {availableCategories.map((category) => {
                const count = videos.filter(v => v.category === category).length;
                const isSelected = selectedCategory === category;
                const categoryColors = getCategoryColor(category);
                
                return (
                  <CarouselItem key={category} className="pl-2 md:pl-4 basis-auto">
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="lg"
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap text-white ${
                        isSelected 
                          ? categoryColors
                          : `border-2 text-gray-700 hover:text-white ${categoryColors.split(' ')[2]} hover:${categoryColors.split(' ')[0]}`
                      }`}
                    >
                      {category} ({count})
                    </Button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </CardContent>
    </Card>
  );
};
