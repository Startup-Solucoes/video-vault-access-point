
import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VideoList } from './video-management/VideoList';

// Importação direta ao invés de lazy para evitar problemas de carregamento
const ClientVideoView = React.lazy(() => 
  import('./video-management/ClientVideoView').then(module => ({ 
    default: module.ClientVideoView 
  }))
);

// Componente de Loading para Suspense
const ComponentLoader = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="text-gray-600">Carregando...</span>
    </div>
  </div>
);

const VideoManagement = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>('');

  const handleClientSelect = (clientId: string, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
  };

  const handleBackToVideos = () => {
    setSelectedClientId(null);
    setSelectedClientName('');
  };

  if (selectedClientId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBackToVideos}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Vídeos
          </Button>
        </div>
        <Suspense fallback={<ComponentLoader />}>
          <ClientVideoView 
            clientId={selectedClientId} 
            clientName={selectedClientName}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Vídeos</CardTitle>
        </CardHeader>
        <CardContent>
          <VideoList onClientSelect={handleClientSelect} />
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoManagement;
export { VideoManagement };
