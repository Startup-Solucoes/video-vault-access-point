
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Tag } from 'lucide-react';

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

  return (
    <Card className="border-0 shadow-sm bg-gray-50/50">
      <CardContent className="p-4">
        {/* Header compacto com busca e toggle de filtros */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Campo de busca principal */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar vídeos por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500"
            />
          </div>

          {/* Controles à direita */}
          <div className="flex items-center gap-3">
            {/* Contador de resultados */}
            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border whitespace-nowrap">
              <span className="font-medium">{filteredVideos}</span> de <span className="font-medium">{totalVideos}</span> vídeos
            </div>

            {/* Toggle de filtros avançados - apenas mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Filtros avançados - sempre visível no desktop, toggle no mobile */}
        <div className={`${showFilters || 'hidden lg:block'} mt-4 pt-4 border-t border-gray-200`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Filtro de categoria */}
            <div className="flex-1 min-w-0 max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Categoria</span>
              </div>
              <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  <SelectItem value="all">
                    <span className="font-medium">Todas ({totalVideos})</span>
                  </SelectItem>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      <span className="font-medium">{category}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão limpar filtros */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>

          {/* Tags de filtros ativos - mais compactas */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">Filtros ativos:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                  Busca: "{searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded-full p-0.5">
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
        </div>
      </CardContent>
    </Card>
  );
};
