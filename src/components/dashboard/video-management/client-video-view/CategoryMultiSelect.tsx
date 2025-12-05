import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryMultiSelectProps {
  availableCategories: string[];
  selectedCategories: string[];
  videoCategoryCounts: Record<string, number>;
  onToggleCategory: (category: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

// Cores específicas para cada categoria (background sólido quando selecionado)
const getCategoryStyles = (category: string, isSelected: boolean) => {
  const colorMap: Record<string, { selected: string; unselected: string }> = {
    'Gerais': { 
      selected: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700', 
      unselected: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700' 
    },
    'Produto': { 
      selected: 'bg-green-600 text-white border-green-600 hover:bg-green-700', 
      unselected: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 hover:border-green-300 dark:hover:border-green-700' 
    },
    'Financeiro': { 
      selected: 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600', 
      unselected: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:border-yellow-300 dark:hover:border-yellow-700' 
    },
    'Relatórios': { 
      selected: 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700', 
      unselected: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700' 
    },
    'Pedidos de venda': { 
      selected: 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700', 
      unselected: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700' 
    },
    'Fiscal': { 
      selected: 'bg-red-600 text-white border-red-600 hover:bg-red-700', 
      unselected: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-300 dark:hover:border-red-700' 
    },
    'Integrações': { 
      selected: 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700', 
      unselected: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:border-teal-300 dark:hover:border-teal-700' 
    },
    'Serviços': { 
      selected: 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700', 
      unselected: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700' 
    },
    'Estoques': { 
      selected: 'bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700', 
      unselected: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 hover:border-cyan-300 dark:hover:border-cyan-700' 
    },
    'Contatos': { 
      selected: 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700', 
      unselected: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/50 hover:border-pink-300 dark:hover:border-pink-700' 
    },
    'Logística': { 
      selected: 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700', 
      unselected: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700' 
    },
    'Frente de caixa': { 
      selected: 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700', 
      unselected: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700' 
    },
    'Reuniões': { 
      selected: 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700', 
      unselected: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/50 hover:border-violet-300 dark:hover:border-violet-700' 
    }
  };

  const defaultStyle = { 
    selected: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700', 
    unselected: 'bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600' 
  };

  const style = colorMap[category] || defaultStyle;
  return isSelected ? style.selected : style.unselected;
};

export const CategoryMultiSelect = ({
  availableCategories,
  selectedCategories,
  videoCategoryCounts,
  onToggleCategory,
  onSelectAll,
  onClearAll
}: CategoryMultiSelectProps) => {
  const hasSelectedCategories = selectedCategories.length > 0;
  const allSelected = selectedCategories.length === availableCategories.length;

  return (
    <div className="space-y-3">
      {/* Header com ações rápidas */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Categorias</span>
        <div className="flex items-center gap-2">
          {hasSelectedCategories && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <X className="h-3 w-3 mr-1" />
              Limpar ({selectedCategories.length})
            </Button>
          )}
          {!allSelected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
            >
              <Check className="h-3 w-3 mr-1" />
              Todas
            </Button>
          )}
        </div>
      </div>

      {/* Grid de categorias como botões */}
      <div className="flex flex-wrap gap-2">
        {availableCategories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const count = videoCategoryCounts[category] || 0;
          
          return (
            <button
              key={category}
              onClick={() => onToggleCategory(category)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium',
                'border transition-all duration-200 cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500',
                getCategoryStyles(category, isSelected)
              )}
            >
              {isSelected && (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>{category}</span>
              <Badge 
                variant="secondary" 
                className={cn(
                  'ml-0.5 h-5 min-w-[1.25rem] px-1.5 text-xs font-semibold',
                  isSelected 
                    ? 'bg-white/20 text-inherit border-0' 
                    : 'bg-white dark:bg-gray-800 text-inherit border border-current/20'
                )}
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Feedback visual quando há filtros ativos */}
      {hasSelectedCategories && (
        <div className="text-xs text-muted-foreground pt-1">
          Mostrando vídeos de {selectedCategories.length} categoria{selectedCategories.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
