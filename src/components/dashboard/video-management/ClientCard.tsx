
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, User, KeyRound, LogIn, Mail } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ClientCardProps {
  client: {
    id: string;
    full_name: string;
    email: string;
    logo_url?: string;
  };
  videoCount: number;
  onClientSelect: (clientId: string, clientName: string, clientLogoUrl?: string) => void;
}

export const ClientCard = ({ client, videoCount, onClientSelect }: ClientCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    onClientSelect(client.id, client.full_name, client.logo_url);
  };

  const handleAccessClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClientSelect(client.id, client.full_name, client.logo_url);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo/Avatar */}
          <div className="w-20 h-20 flex items-center justify-center">
            {client.logo_url && !imageError ? (
              <img 
                src={client.logo_url} 
                alt={`Logo ${client.full_name}`}
                className="w-full h-full object-contain rounded-xl border-2 border-muted shadow-sm bg-background p-1"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center border-2 border-blue-200">
                <User className="h-10 w-10 text-blue-600" />
              </div>
            )}
          </div>

          {/* Nome do Cliente */}
          <div className="text-center w-full">
            <h3 className="font-semibold text-foreground text-lg line-clamp-2 mb-2">
              {client.full_name}
            </h3>
          </div>

          {/* Badge de Vídeos */}
          <Badge 
            variant="secondary" 
            className="flex items-center space-x-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Video className="h-3 w-3" />
            <span>{videoCount} vídeo{videoCount !== 1 ? 's' : ''}</span>
          </Badge>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2 w-full pt-2">
            {/* Botão Acessos com Tooltip */}
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <KeyRound className="h-4 w-4 mr-1" />
                    Acessos
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  sideOffset={8}
                  className="bg-popover text-popover-foreground border shadow-lg p-3 max-w-xs animate-fade-in data-[state=closed]:animate-fade-out"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm break-all">{client.email}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Botão Acessar */}
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={handleAccessClick}
            >
              <LogIn className="h-4 w-4 mr-1" />
              Acessar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
