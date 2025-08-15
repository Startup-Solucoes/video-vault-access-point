
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Megaphone, Users, FileImage, MessageCircle, Calculator, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { AdvertisementDisplay } from '../advertisement-management/AdvertisementDisplay';
import { FileConverterView } from './FileConverterView';
import { WhatsAppLinkGenerator } from './WhatsAppLinkGenerator';
import { ProductPriceCalculator } from './ProductPriceCalculator';
import { ExcelWizardView } from './ExcelWizardView';

export const AdminToolsView = () => {
  const [currentView, setCurrentView] = useState<string>('tools');

  const tools = [
    {
      id: 'advertisements',
      title: 'Gerenciamento de Anúncios',
      description: 'Gerencie anúncios e campanhas publicitárias do sistema',
      icon: Megaphone,
      available: true
    },
    {
      id: 'file-converter',
      title: 'Conversor de Arquivos',
      description: 'Converta arquivos entre diferentes formatos (PDF, JPG, WebP, PNG) e remova fundos automaticamente',
      icon: FileImage,
      available: true
    },
    {
      id: 'whatsapp-generator',
      title: 'Gerador de Link WhatsApp',
      description: 'Crie links personalizados do WhatsApp com mensagens pré-definidas',
      icon: MessageCircle,
      available: true
    },
    {
      id: 'product-calculator',
      title: 'Calculadora de Preço de Produto',
      description: 'Calcule o preço final de venda considerando custos, margem de lucro e taxas de pagamento',
      icon: Calculator,
      available: true
    },
    {
      id: 'excel-wizard',
      title: 'Excel Wizard',
      description: 'Processe planilhas Excel com operações em massa inteligentes',
      icon: FileSpreadsheet,
      available: true
    },
    {
      id: 'user-analytics',
      title: 'Análise de Usuários',
      description: 'Visualize estatísticas e relatórios de uso do sistema',
      icon: Users,
      available: false
    }
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === 'advertisements' || toolId === 'file-converter' || toolId === 'whatsapp-generator' || toolId === 'product-calculator' || toolId === 'excel-wizard') {
      console.log(`Navegando para ${toolId}...`);
      setCurrentView(toolId);
    }
  };

  const handleBackToTools = () => {
    setCurrentView('tools');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'advertisements':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToTools}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Anúncios</h2>
            </div>
            <AdvertisementDisplay />
          </div>
        );
      
      case 'file-converter':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToTools}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
            </div>
            <FileConverterView />
          </div>
        );

      case 'whatsapp-generator':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToTools}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">Gerador de Link WhatsApp</h2>
            </div>
            <WhatsAppLinkGenerator />
          </div>
        );

      case 'product-calculator':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToTools}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <h2 className="text-2xl font-bold text-gray-900">Calculadora de Preço de Produto</h2>
            </div>
            <ProductPriceCalculator />
          </div>
        );

      case 'excel-wizard':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToTools}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
            </div>
            <ExcelWizardView />
          </div>
        );

      
      default:
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
    }
  };

  return renderCurrentView();
};
