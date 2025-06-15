
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Video, 
  Download, 
  Share2, 
  Zap, 
  Shield, 
  Headphones, 
  Clock,
  Check,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AdvertisementCarousel } from './AdvertisementCarousel';
import { Advertisement } from '@/types/advertisement';

interface ServicesViewProps {
  advertisements: Advertisement[];
}

export const ServicesView = ({ advertisements }: ServicesViewProps) => {
  const services = [
    {
      id: 1,
      title: "Streaming Premium",
      description: "Acesso a vídeos em alta qualidade com streaming otimizado",
      icon: Video,
      features: ["Qualidade 4K", "Streaming rápido", "Sem anúncios"],
      status: "active",
      color: "blue"
    },
    {
      id: 2,
      title: "Downloads Ilimitados",
      description: "Baixe seus vídeos para assistir offline",
      icon: Download,
      features: ["Download em lote", "Múltiplos formatos", "Sem limite"],
      status: "active",
      color: "green"
    },
    {
      id: 3,
      title: "Compartilhamento Avançado",
      description: "Compartilhe conteúdo com controles avançados",
      icon: Share2,
      features: ["Links privados", "Controle de acesso", "Analytics"],
      status: "premium",
      color: "purple"
    },
    {
      id: 4,
      title: "Suporte Priority",
      description: "Atendimento prioritário e suporte técnico",
      icon: Headphones,
      features: ["Chat 24/7", "Suporte técnico", "Resposta rápida"],
      status: "active",
      color: "orange"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'premium': return 'Premium';
      default: return 'Indisponível';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Serviços e Ofertas</h1>
            <p className="text-purple-100">
              Explore nossos serviços premium e ofertas especiais
            </p>
          </div>
        </div>
      </div>

      {/* Serviços em destaque - carrossel de anúncios */}
      {advertisements && advertisements.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Ofertas Especiais</h2>
            <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1 ml-4"></div>
          </div>
          <AdvertisementCarousel advertisements={advertisements} />
        </div>
      )}

      {/* Serviços principais */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Star className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Serviços Principais</h2>
          <div className="h-px bg-gradient-to-r from-blue-400 to-transparent flex-1 ml-4"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-gray-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-${service.color}-100`}>
                        <IconComponent className={`h-6 w-6 text-${service.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="group-hover:text-gray-900 transition-colors">
                          {service.title}
                        </CardTitle>
                        <Badge className={`mt-1 ${getStatusColor(service.status)}`}>
                          {getStatusText(service.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full mt-4 group/btn" 
                      variant={service.status === 'active' ? 'default' : 'outline'}
                      disabled={service.status === 'premium'}
                    >
                      {service.status === 'active' ? 'Acessar Serviço' : 'Upgrade Necessário'}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Seção de recursos adicionais */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Zap className="h-5 w-5" />
            Recursos Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Segurança</h4>
                <p className="text-sm text-blue-700">Conteúdo protegido</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Disponibilidade</h4>
                <p className="text-sm text-blue-700">Acesso 24/7</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
              <Video className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-900">Qualidade</h4>
                <p className="text-sm text-blue-700">HD & 4K</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to action */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Precisa de mais recursos?</h3>
            <p className="text-gray-300 mb-4">
              Entre em contato conosco para explorar opções de upgrade e serviços personalizados.
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
