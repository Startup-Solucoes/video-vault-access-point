
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X, Tag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryTextColor } from '@/utils/categoryColors';

interface ClientVideoFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availableCategories: string[];
  totalVideos: number;
  filteredVideos: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const ClientVideoFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  availableCategories,
  totalVideos,
  filteredVideos,
  showFilters,
  setShowFilters
}: ClientVideoFiltersProps) => {
  const hasActiveFilters = searchTerm || selectedCategory;

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      setSelectedCategory('');
    } else {
      setSelectedCategory(value);
    }
  };

  const getCategoryDisplayValue = () => {
    if (selectedCategory === '') {
      return 'all';
    }
    return selectedCategory;
  };

  return (
    <Card className="mb-6 shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Header dos filtros */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Search className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Buscar e Filtrar Vídeos</h3>
              <p className="text-sm text-gray-600">Encontre vídeos por título ou categoria</p>
            </div>
          </div>
          
          <div className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {filteredVideos} de {totalVideos} vídeos
          </div>
        </div>

        {/* Campo de busca principal */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Digite para buscar vídeos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-50 focus:bg-white transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filtros - sempre visível no desktop, toggle no mobile */}
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Toggle filtros mobile */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full justify-center border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>

          {/* Filtros */}
          <div className={`${showFilters || 'hidden lg:flex'} flex flex-col sm:flex-row lg:flex-row gap-4 flex-1 w-full`}>
            {/* Filtro de categorias */}
            {availableCategories.length > 0 && (
              <div className="flex-1 min-w-0">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4" />
                      Categoria
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select value={getCategoryDisplayValue()} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <span className="font-medium">Todas as categorias ({totalVideos})</span>
                        </SelectItem>
                        {availableCategories.map((category) => {
                          const categoryColor = getCategoryTextColor(category);
                          
                          return (
                            <SelectItem key={category} value={category}>
                              <span className={`font-medium ${categoryColor}`}>
                                {category}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Botão limpar filtros */}
            {hasActiveFilters && (
              <Button 
                variant="outline"
                onClick={clearAllFilters}
                className="whitespace-nowrap bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Tags de filtros ativos */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-600">Filtros ativos:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                Busca: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:bg-gray-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                Categoria: {selectedCategory}
                <button onClick={() => setSelectedCategory('')} className="hover:bg-green-200 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
