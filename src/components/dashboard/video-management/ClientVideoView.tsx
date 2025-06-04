
import React from 'react';
import { ClientVideoViewContainer } from './client-video-view/ClientVideoViewContainer';

interface ClientVideoViewProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientVideoView = ({ clientId, clientName, clientLogoUrl }: ClientVideoViewProps) => {
  return (
    <ClientVideoViewContainer 
      clientId={clientId} 
      clientName={clientName} 
      clientLogoUrl={clientLogoUrl} 
    />
  );
};
