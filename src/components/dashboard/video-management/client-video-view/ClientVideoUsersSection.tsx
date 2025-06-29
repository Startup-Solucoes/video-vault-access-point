
import React from 'react';

interface ClientVideoUsersSectionProps {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientLogoUrl?: string;
  showUsersManager: boolean;
}

export const ClientVideoUsersSection = ({
  showUsersManager
}: ClientVideoUsersSectionProps) => {
  // Agora que temos uma tela separada, este componente não precisa renderizar nada
  // quando showUsersManager for true, pois vamos navegar para uma tela dedicada
  if (!showUsersManager) return null;

  return null; // Componente removido, agora usamos tela separada
};
