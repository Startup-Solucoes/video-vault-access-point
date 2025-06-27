
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Megaphone } from 'lucide-react';
import { AdvertisementManagement } from '../advertisement-management/AdvertisementManagement';

interface AdminToolsViewProps {
  selectedTool: string | null;
  onToolSelect: (tool: string | null) => void;
}

export const AdminToolsView = ({ selectedTool, onToolSelect }: AdminToolsViewProps) => {
  const tools = [
    {
      id: 'advertisements',
      title: 'Gerenciamento de Anúncios',
      description: 'Crie e gerencie anúncios para exibir aos clientes',
      icon: Megaphone,
      component: AdvertisementManagement
    }
  ];

  const renderToolContent = () => {
    const tool = tools.find(t => t.id === selectedTool);
    if (!tool) return null;

    const ToolComponent = tool.component;
    return <ToolComponent />;
  };

  if (selectedTool) {
    const tool = tools.find(t => t.id === selectedTool);
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => onToolSelect(null)}
          >
            ← Voltar às Ferramentas
          </Button>
          <h2 className="text-2xl font-bold">{tool?.title}</h2>
        </div>
        {renderToolContent()}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Ferramentas Administrativas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <tool.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <Button 
                onClick={() => onToolSelect(tool.id)}
                className="w-full"
              >
                Abrir Ferramenta
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
