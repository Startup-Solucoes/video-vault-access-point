
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClientLogo } from './ClientLogo';
import { ClientInfo } from './ClientInfo';
import { ClientEmailEditor } from './ClientEmailEditor';
import { ClientPasswordEditor } from './ClientPasswordEditor';
import { LastPasswordDisplay } from './LastPasswordDisplay';

interface MainClientCardProps {
  clientEmail: string;
  clientName: string;
  clientLogoUrl?: string;
  lastUpdatedPassword?: string | null;
  showLastPassword?: boolean;
  onUpdatePassword: (newPassword: string) => void;
  onUpdateEmail: (newEmail: string) => void;
  onTogglePasswordVisibility?: () => void;
  onCopyLastPassword?: () => void;
}

export const MainClientCard = ({
  clientEmail,
  clientName,
  clientLogoUrl,
  lastUpdatedPassword,
  showLastPassword = false,
  onUpdatePassword,
  onUpdateEmail,
  onTogglePasswordVisibility,
  onCopyLastPassword
}: MainClientCardProps) => {
  console.log('🔍 MainClientCard - Dados do cliente principal:', {
    clientEmail,
    clientName,
    clientLogoUrl,
    hasLogo: !!clientLogoUrl
  });

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <ClientLogo clientName={clientName} clientLogoUrl={clientLogoUrl} />

          <div className="flex-1 space-y-4">
            <ClientInfo clientName={clientName} />
            <ClientEmailEditor clientEmail={clientEmail} onUpdateEmail={onUpdateEmail} />
            <ClientPasswordEditor onUpdatePassword={onUpdatePassword} />

            {lastUpdatedPassword && (
              <LastPasswordDisplay
                lastUpdatedPassword={lastUpdatedPassword}
                showLastPassword={showLastPassword}
                onTogglePasswordVisibility={onTogglePasswordVisibility}
                onCopyLastPassword={onCopyLastPassword}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
