
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VideoFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availableCategories: string[];
  videos: any[];
}

export const VideoFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  videos
}: VideoFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros e Busca
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Input 
            placeholder="Buscar vídeos..." 
            className="flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>

        {availableCategories.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Filtrar por Categoria:</h4>
            <div className="relative">
              <Carousel className="w-full max-w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  <CarouselItem className="pl-2 md:pl-4 basis-auto">
                    <Button
                      variant={selectedCategory === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('')}
                      className="whitespace-nowrap"
                    >
                      Todas ({videos.length})
                    </Button>
                  </CarouselItem>
                  {availableCategories.map((category) => {
                    const count = videos.filter(v => v.category === category).length;
                    return (
                      <CarouselItem key={category} className="pl-2 md:pl-4 basis-auto">
                        <Button
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className="whitespace-nowrap"
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};
