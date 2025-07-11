
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ExternalLink, 
  Users, 
  Image as ImageIcon,
  DollarSign
} from 'lucide-react';
import { AdvertisementWithPermissions } from '@/types/advertisement';
import { AdvertisementCardActions } from './AdvertisementCardActions';

interface AdvertisementCardProps {
  advertisement: AdvertisementWithPermissions;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onManagePermissions: (id: string) => void;
  isDeleting: boolean;
}

export const AdvertisementCard = ({ 
  advertisement: ad, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onManagePermissions,
  isDeleting 
}: AdvertisementCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
              {ad.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={ad.is_active ? "default" : "secondary"}>
                {ad.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {ad.client_count === 0 ? 'Global' : `${ad.client_count}`}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Imagem do anúncio com proporção 1:1 */}
        <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {ad.image_url ? (
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                }
              }}
            />
          ) : (
            <ImageIcon className="h-12 w-12 text-gray-400" />
          )}
        </div>

        {/* Descrição */}
        {ad.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {ad.description}
          </p>
        )}

        {/* Preço */}
        {ad.price && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="font-semibold text-green-800">
              {formatPrice(ad.price)}
            </span>
          </div>
        )}

        {/* Link */}
        <div className="flex items-center space-x-2">
          <ExternalLink className="h-3 w-3 text-blue-600" />
          <a 
            href={ad.link_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-xs truncate flex-1"
          >
            {ad.link_url}
          </a>
        </div>

        {/* Ações */}
        <AdvertisementCardActions
          advertisementId={ad.id}
          advertisementTitle={ad.title}
          isActive={ad.is_active}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
          onManagePermissions={onManagePermissions}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
};
