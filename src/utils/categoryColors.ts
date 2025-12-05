
// Cores para cada categoria - centralizadas para uso em toda a aplicação
export const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Gerais': 'bg-blue-600 text-white',
    'Produto': 'bg-green-600 text-white',
    'Financeiro': 'bg-yellow-600 text-white',
    'Relatórios': 'bg-purple-600 text-white',
    'Pedidos de venda': 'bg-orange-600 text-white',
    'Fiscal': 'bg-red-600 text-white',
    'Integrações': 'bg-teal-600 text-white',
    'Serviços': 'bg-indigo-600 text-white',
    'Estoques': 'bg-cyan-600 text-white',
    'Contatos': 'bg-pink-600 text-white',
    'Logística': 'bg-amber-600 text-white',
    'Frente de caixa': 'bg-emerald-600 text-white',
    'Reuniões': 'bg-violet-600 text-white'
  };
  
  // Cor padrão se a categoria não estiver mapeada
  return colors[category] || 'bg-gray-600 text-white';
};

// Versão para texto (sem background) - usada em selects e filtros
export const getCategoryTextColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Gerais': 'text-blue-600',
    'Produto': 'text-green-600',
    'Financeiro': 'text-yellow-600',
    'Relatórios': 'text-purple-600',
    'Pedidos de venda': 'text-orange-600',
    'Fiscal': 'text-red-600',
    'Integrações': 'text-teal-600',
    'Serviços': 'text-indigo-600',
    'Estoques': 'text-cyan-600',
    'Contatos': 'text-pink-600',
    'Logística': 'text-amber-600',
    'Frente de caixa': 'text-emerald-600',
    'Reuniões': 'text-violet-600'
  };
  
  return colors[category] || 'text-gray-600';
};
