
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { VideoReorderList } from '../VideoReorderList';
import { ClientVideoData } from '@/hooks/useClientVideos';

interface ClientVideoReorderModeProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
  videos: ClientVideoData[];
  onExitReorderMode: () => void;
  onReorderComplete: () => void;
}

export const ClientVideoReorderMode = ({
  clientId,
  clientName,
  clientLogoUrl,
  videos,
  onExitReorderMode,
  onReorderComplete
}: ClientVideoReorderModeProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center">
            {clientLogoUrl ? (
              <img 
                src={clientLogoUrl} 
                alt={`Logo ${clientName}`}
                className="h-8 w-8 mr-3 object-contain rounded"
              />
            ) : (
              <User className="h-5 w-5 mr-2" />
            )}
            Reordenar Vídeos - {clientName}
          </CardTitle>
          <Button
            variant="outline"
            onClick={onExitReorderMode}
            size="sm"
          >
            Voltar para Lista
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <VideoReorderList
          clientId={clientId}
          clientName={clientName}
          videos={videos}
          onReorderComplete={onReorderComplete}
        />
      </CardContent>
    </Card>
  );
};
