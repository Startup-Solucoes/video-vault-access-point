
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VideoList } from './video-management/VideoList';
import { ClientVideoView } from './video-management/ClientVideoView';

export const VideoManagement = () => {
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
        <ClientVideoView 
          clientId={selectedClientId} 
          clientName={selectedClientName}
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
          <VideoList onClientSelect={handleClientSelect} />
        </CardContent>
      </Card>
    </div>
  );
};
