
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  Zap, 
  Shield, 
  Headphones, 
  Clock,
  Video,
  Sparkles
} from 'lucide-react';
import { AdvertisementCarousel } from './AdvertisementCarousel';
import { Advertisement } from '@/types/advertisement';

interface ServicesViewProps {
  advertisements: Advertisement[];
}

export const ServicesView = ({ advertisements }: ServicesViewProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Nossos Serviços</h1>
            <p className="text-gray-200">
              Descubra nossos serviços exclusivos e ofertas especiais
            </p>
          </div>
        </div>
      </div>

      {/* Serviços disponíveis */}
      {advertisements && advertisements.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Serviços Disponíveis</h2>
            <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map((ad) => (
              <Card 
                key={ad.id} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-orange-50 overflow-hidden"
                onClick={() => window.open(ad.link_url, '_blank', 'noopener,noreferrer')}
              >
                <CardContent className="p-0">
                  {/* Imagem do serviço */}
                  <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center overflow-hidden relative">
                    {ad.image_url ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={ad.image_url} 
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-12 w-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                            }
                          }}
                        />
                        {/* Overlay com ícone de destaque */}
                        <div className="absolute top-3 right-3">
                          <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <Star className="h-16 w-16 text-yellow-600" />
                        <div className="absolute top-3 right-3">
                          <div className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Conteúdo do card */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Título */}
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-yellow-700 transition-colors">
                        {ad.title}
                      </h3>
                      
                      {/* Descrição */}
                      {ad.description && (
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {ad.description}
                        </p>
                      )}
                      
                      {/* Preço */}
                      {ad.price && (
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md text-center">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(ad.price)}
                        </div>
                      )}
                      
                      {/* Botão de ação */}
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(ad.link_url, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Solicitar Serviço
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Estado vazio */
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-200 rounded-full">
                <Star className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Nenhum serviço disponível no momento
              </h3>
              <p className="text-gray-600 max-w-md">
                Novos serviços serão adicionados em breve. Fique atento às atualizações!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seção de recursos adicionais */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Zap className="h-5 w-5" />
            Por que escolher nossos serviços?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Shield className="h-8 w-8 text-gray-700" />
              <div>
                <h4 className="font-medium text-gray-900">Segurança</h4>
                <p className="text-sm text-gray-700">Serviços confiáveis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Clock className="h-8 w-8 text-gray-700" />
              <div>
                <h4 className="font-medium text-gray-900">Agilidade</h4>
                <p className="text-sm text-gray-700">Entrega rápida</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Headphones className="h-8 w-8 text-gray-700" />
              <div>
                <h4 className="font-medium text-gray-900">Suporte</h4>
                <p className="text-sm text-gray-700">Atendimento especializado</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to action */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Precisa de algo específico?</h3>
            <p className="text-gray-300 mb-4">
              Entre em contato conosco para serviços personalizados e orçamentos sob medida.
            </p>
            <Button variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              Entrar em Contato
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
