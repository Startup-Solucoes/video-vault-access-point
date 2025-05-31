
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
                return (
                  <CarouselItem key={category} className="pl-2 md:pl-4 basis-auto">
                    <Button
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="lg"
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
      </CardContent>
    </Card>
  );
};
