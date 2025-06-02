
import React from 'react';
import { ClientVideoView } from './ClientVideoView';

interface ClientVideoViewWrapperProps {
  clientId: string;
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientVideoViewWrapper = ({ clientId, clientName, clientLogoUrl }: ClientVideoViewWrapperProps) => {
  return (
    <ClientVideoView 
      clientId={clientId} 
      clientName={clientName} 
      clientLogoUrl={clientLogoUrl}
    />
  );
};

export default ClientVideoViewWrapper;
