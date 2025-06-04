
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Video } from 'lucide-react';
import { VideoList } from './video-management/VideoList';
import { ClientVideoView } from './video-management/ClientVideoView';
import { AllVideosView } from './video-management/AllVideosView';

const VideoManagement = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [selectedClientLogoUrl, setSelectedClientLogoUrl] = useState<string | undefined>();

  const handleClientSelect = (clientId: string, clientName: string, clientLogoUrl?: string) => {
    console.log('🎯 Selecionando cliente:', { clientId, clientName });
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setSelectedClientLogoUrl(clientLogoUrl);
  };

  const handleBackToVideos = () => {
    console.log('🔙 Voltando para lista de vídeos');
    setSelectedClientId(null);
    setSelectedClientName('');
    setSelectedClientLogoUrl(undefined);
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
        <ClientVideoView 
          clientId={selectedClientId} 
          clientName={selectedClientName}
          clientLogoUrl={selectedClientLogoUrl}
        />
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
          <Tabs defaultValue="by-client" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="by-client" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Por Cliente
              </TabsTrigger>
              <TabsTrigger value="all-videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Todos os Vídeos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="by-client" className="mt-6">
              <VideoList onClientSelect={handleClientSelect} />
            </TabsContent>
            
            <TabsContent value="all-videos" className="mt-6">
              <AllVideosView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoManagement;
export { VideoManagement };
