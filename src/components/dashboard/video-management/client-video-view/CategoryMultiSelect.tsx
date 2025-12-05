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
      unselected: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300' 
    },
    'Produto': { 
      selected: 'bg-green-600 text-white border-green-600 hover:bg-green-700', 
      unselected: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300' 
    },
    'Financeiro': { 
      selected: 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600', 
      unselected: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300' 
    },
    'Relatórios': { 
      selected: 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700', 
      unselected: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300' 
    },
    'Pedidos de venda': { 
      selected: 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700', 
      unselected: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300' 
    },
    'Fiscal': { 
      selected: 'bg-red-600 text-white border-red-600 hover:bg-red-700', 
      unselected: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:border-red-300' 
    },
    'Integrações': { 
      selected: 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700', 
      unselected: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 hover:border-teal-300' 
    },
    'Serviços': { 
      selected: 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700', 
      unselected: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300' 
    },
    'Estoques': { 
      selected: 'bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700', 
      unselected: 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300' 
    },
    'Contatos': { 
      selected: 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700', 
      unselected: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:border-pink-300' 
    },
    'Logística': { 
      selected: 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700', 
      unselected: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300' 
    },
    'Frente de caixa': { 
      selected: 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700', 
      unselected: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300' 
    }
  };

  const defaultStyle = { 
    selected: 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700', 
    unselected: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300' 
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
        <span className="text-sm font-medium text-gray-600">Categorias</span>
        <div className="flex items-center gap-2">
          {hasSelectedCategories && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-7 px-2 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50"
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
              className="h-7 px-2 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50"
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
                    : 'bg-white text-inherit border border-current/20'
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
        <div className="text-xs text-gray-500 pt-1">
          Mostrando vídeos de {selectedCategories.length} categoria{selectedCategories.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
