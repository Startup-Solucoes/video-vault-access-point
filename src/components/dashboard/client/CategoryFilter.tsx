
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

// Cores para cada categoria com destaque no background e texto
const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Gerais': 'bg-blue-600 hover:bg-blue-700 text-white border-blue-300',
    'Produto': 'bg-green-600 hover:bg-green-700 text-white border-green-300',
    'Financeiro': 'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-300',
    'Relatórios': 'bg-purple-600 hover:bg-purple-700 text-white border-purple-300',
    'Pedidos de venda': 'bg-orange-600 hover:bg-orange-700 text-white border-orange-300',
    'Fiscal': 'bg-red-600 hover:bg-red-700 text-white border-red-300',
    'Integrações': 'bg-teal-600 hover:bg-teal-700 text-white border-teal-300',
    'Serviços': 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-300'
  };
  
  // Cor padrão se a categoria não estiver mapeada
  return colors[category] || 'bg-gray-600 hover:bg-gray-700 text-white border-gray-300';
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
                  className={`whitespace-nowrap font-semibold ${
                    selectedCategory === '' 
                      ? 'bg-slate-800 hover:bg-slate-900 text-white' 
                      : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
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
                      variant="outline"
                      size="lg"
                      onClick={() => setSelectedCategory(category)}
                      className={`whitespace-nowrap font-semibold transition-all duration-200 ${
                        isSelected 
                          ? `${categoryColors} shadow-lg border-2`
                          : `border-2 text-gray-600 hover:text-white ${categoryColors} opacity-80 hover:opacity-100 hover:shadow-md`
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
