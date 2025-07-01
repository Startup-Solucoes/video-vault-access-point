
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdvertisementDisplay } from '../advertisement-management/AdvertisementDisplay';
import { Settings, Megaphone, Users, Database } from 'lucide-react';

export const AdminToolsView = () => {
  const tools = [
    {
      id: 'advertisements',
      title: 'Gerenciamento de Anúncios',
      description: 'Gerencie anúncios e campanhas publicitárias do sistema',
      icon: Megaphone,
      component: <AdvertisementDisplay />,
      available: true
    },
    {
      id: 'system-config',
      title: 'Configurações do Sistema',
      description: 'Configure parâmetros gerais e preferências do sistema',
      icon: Settings,
      component: null,
      available: false
    },
    {
      id: 'user-analytics',
      title: 'Análise de Usuários',
      description: 'Visualize estatísticas e relatórios de uso do sistema',
      icon: Users,
      component: null,
      available: false
    },
    {
      id: 'database-tools',
      title: 'Ferramentas de Banco',
      description: 'Utilitários para manutenção e backup do banco de dados',
      icon: Database,
      component: null,
      available: false
    }
  ];

  const [selectedTool, setSelectedTool] = React.useState<string>('advertisements');

  const currentTool = tools.find(tool => tool.id === selectedTool);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ferramentas Administrativas</h2>
        <p className="text-gray-600 mb-8">
          Gerencie anúncios e outras funcionalidades administrativas do sistema.
        </p>
      </div>

      {/* Grid de Cards das Ferramentas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tools.map((tool) => (
          <Card 
            key={tool.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTool === tool.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            } ${
              !tool.available 
                ? 'opacity-60 cursor-not-allowed' 
                : ''
            }`}
            onClick={() => tool.available && setSelectedTool(tool.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedTool === tool.id 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <tool.icon className="h-5 w-5" />
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
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Em Desenvolvimento
                </div>
              )}
              {tool.available && selectedTool === tool.id && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Ativo
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Conteúdo da Ferramenta Selecionada */}
      {currentTool && currentTool.component && (
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <currentTool.icon className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                {currentTool.title}
              </h3>
            </div>
          </div>
          <div className="p-6">
            {currentTool.component}
          </div>
        </div>
      )}
    </div>
  );
};
