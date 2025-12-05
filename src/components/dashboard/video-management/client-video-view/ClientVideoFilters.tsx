
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X, Tag, CheckSquare, Square, ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryMultiSelect } from './CategoryMultiSelect';
import { cn } from '@/lib/utils';

interface ClientVideoFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectAllCategories: () => void;
  clearCategories: () => void;
  availableCategories: string[];
  videoCategoryCounts: Record<string, number>;
  totalVideos: number;
  filteredVideos: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedVideos: string[];
  allVideosSelected: boolean;
  onSelectAllVisible: () => void;
  onShowReorderMode: () => void;
}

export const ClientVideoFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategories,
  toggleCategory,
  selectAllCategories,
  clearCategories,
  availableCategories,
  videoCategoryCounts,
  totalVideos,
  filteredVideos,
  showFilters,
  setShowFilters,
  selectedVideos,
  allVideosSelected,
  onSelectAllVisible,
  onShowReorderMode
}: ClientVideoFiltersProps) => {
  const [showCategoryPanel, setShowCategoryPanel] = useState(true);
  const hasActiveFilters = searchTerm || selectedCategories.length > 0;
  const hasSelectedVideos = selectedVideos.length > 0;

  const clearAllFilters = () => {
    setSearchTerm('');
    clearCategories();
  };

  return (
    <Card className="border-0 shadow-sm bg-card">
      <CardContent className="p-4 space-y-4">
        {/* Linha principal com busca e controles */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Busca */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vídeos por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>

          {/* Controles de ação */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle do painel de categorias */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryPanel(!showCategoryPanel)}
              className={cn(
                "flex items-center gap-2",
                selectedCategories.length > 0 
                  ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300" 
                  : ""
              )}
            >
              <Tag className="h-4 w-4" />
              <span className="hidden sm:inline">Categorias</span>
              {selectedCategories.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem]">
                  {selectedCategories.length}
                </span>
              )}
              {showCategoryPanel ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAllVisible}
              className={cn(
                "flex items-center gap-2",
                allVideosSelected ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300" : ""
              )}
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

            <Button
              variant="outline"
              size="sm"
              onClick={onShowReorderMode}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">Reordenar</span>
            </Button>

            {/* Contador de resultados */}
            <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg border border-border whitespace-nowrap">
              <span className="font-medium text-foreground">{filteredVideos}</span> de <span className="font-medium text-foreground">{totalVideos}</span>
            </div>
          </div>
        </div>

        {/* Painel de categorias expansível */}
        {showCategoryPanel && (
          <div className="pt-3 border-t border-border">
            <CategoryMultiSelect
              availableCategories={availableCategories}
              selectedCategories={selectedCategories}
              videoCategoryCounts={videoCategoryCounts}
              onToggleCategory={toggleCategory}
              onSelectAll={selectAllCategories}
              onClearAll={clearCategories}
            />
          </div>
        )}

        {/* Área de controles adicionais - aparece quando há seleções ou filtros ativos */}
        {(hasActiveFilters || hasSelectedVideos) && (
          <div className="pt-3 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Tags de filtros ativos */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-medium text-muted-foreground">Filtros ativos:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs rounded-md">
                      "{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategories.length > 0 && selectedCategories.length <= 3 && (
                    selectedCategories.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs rounded-md">
                        {cat}
                        <button onClick={() => toggleCategory(cat)} className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                  {selectedCategories.length > 3 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs rounded-md">
                      {selectedCategories.length} categorias
                      <button onClick={clearCategories} className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Informações de seleção */}
              {hasSelectedVideos && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md font-medium">
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
                  className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-700 whitespace-nowrap"
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
