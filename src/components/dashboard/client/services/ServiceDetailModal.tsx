import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, Star } from 'lucide-react';
import { Advertisement } from '@/types/advertisement';

interface ServiceDetailModalProps {
  advertisement: Advertisement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServiceDetailModal = ({ 
  advertisement, 
  open, 
  onOpenChange 
}: ServiceDetailModalProps) => {
  if (!advertisement) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleRequestService = () => {
    window.open(advertisement.link_url, '_blank', 'noopener,noreferrer');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-600" />
            {advertisement.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Service Image */}
          <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center overflow-hidden rounded-lg relative">
            {advertisement.image_url ? (
              <img 
                src={advertisement.image_url} 
                alt={advertisement.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-16 w-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                  }
                }}
              />
            ) : (
              <Star className="h-20 w-20 text-yellow-600" />
            )}
          </div>
          
          {/* Price */}
          {advertisement.price && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-4 rounded-lg font-bold text-xl shadow-md text-center">
              {formatPrice(advertisement.price)}
            </div>
          )}
          
          {/* Full Description */}
          {advertisement.description && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                Descrição do Serviço
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {advertisement.description}
                </p>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleRequestService}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Solicitar Serviço
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open(advertisement.link_url, '_blank', 'noopener,noreferrer')}
              className="px-4 py-3 border-gray-300 hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};