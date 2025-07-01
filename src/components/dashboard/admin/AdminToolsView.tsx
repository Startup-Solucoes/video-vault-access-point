
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Megaphone, Users, Database } from 'lucide-react';

export const AdminToolsView = () => {
  const tools = [
    {
      id: 'advertisements',
      title: 'Gerenciamento de Anúncios',
      description: 'Gerencie anúncios e campanhas publicitárias do sistema',
      icon: Megaphone,
      available: true
    },
    {
      id: 'system-config',
      title: 'Configurações do Sistema',
      description: 'Configure parâmetros gerais e preferências do sistema',
      icon: Settings,
      available: false
    },
    {
      id: 'user-analytics',
      title: 'Análise de Usuários',
      description: 'Visualize estatísticas e relatórios de uso do sistema',
      icon: Users,
      available: false
    },
    {
      id: 'database-tools',
      title: 'Ferramentas de Banco',
      description: 'Utilitários para manutenção e backup do banco de dados',
      icon: Database,
      available: false
    }
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === 'advertisements') {
      // Aqui você pode implementar a navegação para a tela de gerenciamento de anúncios
      console.log('Navegando para gerenciamento de anúncios...');
      // Exemplo: navigate('/admin/advertisements');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ferramentas Administrativas</h2>
        <p className="text-gray-600 mb-8">
          Selecione uma ferramenta para acessar suas funcionalidades.
        </p>
      </div>

      {/* Grid de Cards das Ferramentas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card 
            key={tool.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-md ${
              !tool.available 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:scale-105'
            }`}
            onClick={() => tool.available && handleToolClick(tool.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  tool.available 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm text-gray-600 mb-4">
                {tool.description}
              </CardDescription>
              {!tool.available && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Em Desenvolvimento
                </div>
              )}
              {tool.available && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Disponível
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
