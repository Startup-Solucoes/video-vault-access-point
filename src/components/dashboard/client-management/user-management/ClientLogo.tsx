
import React from 'react';
import { User } from 'lucide-react';

interface ClientLogoProps {
  clientName: string;
  clientLogoUrl?: string;
}

export const ClientLogo = ({ clientName, clientLogoUrl }: ClientLogoProps) => {
  return (
    <div className="flex-shrink-0">
      {clientLogoUrl ? (
        <img
          src={clientLogoUrl}
          alt={`Logo ${clientName}`}
          className="w-16 h-16 rounded-lg object-cover border-2 border-blue-300 bg-white p-1"
          onError={(e) => {
            console.error('Erro ao carregar logo:', clientLogoUrl);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-blue-300"><svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
            }
          }}
        />
      ) : (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-blue-300">
          <User className="h-8 w-8 text-blue-600" />
        </div>
      )}
    </div>
  );
};
