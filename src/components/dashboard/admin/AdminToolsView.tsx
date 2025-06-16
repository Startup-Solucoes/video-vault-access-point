
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Settings } from 'lucide-react';
import { ThumbnailGenerator } from '../ThumbnailGenerator';
import { AdvertisementManagement } from '../advertisement-management/AdvertisementManagement';

// Componente de Loading para Suspense
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-gray-600 text-sm">Carregando componente...</span>
    </div>
  </div>
);

interface AdminToolsViewProps {
  selectedTool: string | null;
  onToolSelect: (tool: string | null) => void;
}

export const AdminToolsView = ({ selectedTool, onToolSelect }: AdminToolsViewProps) => {
  if (!selectedTool) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200 group"
          onClick={() => onToolSelect('thumbnails')}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 group-hover:text-blue-600 transition-colors">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              Gerador de Thumbnails
              <Badge variant="outline" className="ml-auto border-orange-200 text-orange-700">
                Em Breve
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Gere thumbnails automaticamente para vídeos que não possuem imagem de capa
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Suporta: ScreenPal, YouTube e Vimeo</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-green-200 group"
          onClick={() => onToolSelect('advertisements')}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 group-hover:text-green-600 transition-colors">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Settings className="h-5 w-5 text-green-600" />
              </div>
              Gerenciar Anúncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              Crie, edite e gerencie anúncios que serão exibidos para os clientes
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Controle total de permissões</span>
              <Button variant="outline" size="sm" className="border-green-200 text-green-600 hover:bg-green-50">
                Acessar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => onToolSelect(null)}
          className="border-gray-200 hover:bg-gray-50"
        >
          ← Voltar às Ferramentas
        </Button>
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedTool === 'thumbnails' ? 'Gerador de Thumbnails' : 'Gerenciar Anúncios'}
        </h2>
      </div>
      
      {selectedTool === 'thumbnails' && <ThumbnailGenerator />}
      {selectedTool === 'advertisements' && (
        <Suspense fallback={<ComponentLoader />}>
          <AdvertisementManagement />
        </Suspense>
      )}
    </div>
  );
};
