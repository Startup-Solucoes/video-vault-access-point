
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Tag, CheckSquare, Square } from 'lucide-react';

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
  // Adicionando props para seleção
  selectedVideos: string[];
  allVideosSelected: boolean;
  onSelectAllVisible: () => void;
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
  setShowFilters,
  selectedVideos,
  allVideosSelected,
  onSelectAllVisible
}: ClientVideoFiltersProps) => {
  const hasActiveFilters = searchTerm || selectedCategory;
  const hasSelectedVideos = selectedVideos.length > 0;

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-4">
        {/* Linha principal com busca, filtros e controles */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Busca - ocupa mais espaço */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar vídeos por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-500"
            />
          </div>

          {/* Filtros lado a lado - sempre visível no desktop */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
            {/* Filtro de categoria */}
            <div className="min-w-0 w-full sm:w-48">
              <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                <SelectTrigger className="bg-white border-gray-200">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
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

            {/* Controles de seleção */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSelectAllVisible}
                className={`${allVideosSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white'} flex items-center gap-2`}
              >
                {allVideosSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {allVideosSelected ? 'Desmarcar' : 'Selecionar'}
                </span>
              </Button>

              {/* Contador de resultados */}
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border whitespace-nowrap">
                <span className="font-medium">{filteredVideos}</span> de <span className="font-medium">{totalVideos}</span>
              </div>
            </div>
          </div>

          {/* Toggle de filtros - apenas mobile */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden bg-white w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
        </div>

        {/* Área de controles adicionais - aparece quando há seleções ou filtros ativos */}
        {(hasActiveFilters || hasSelectedVideos) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Tags de filtros ativos */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-medium text-gray-500">Filtros:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                      "{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('')} className="hover:bg-green-200 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Informações de seleção */}
              {hasSelectedVideos && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                    {selectedVideos.length} selecionado{selectedVideos.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Botão limpar filtros */}
              {hasActiveFilters && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 whitespace-nowrap"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
