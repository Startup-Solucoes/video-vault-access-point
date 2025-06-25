
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Advertisement } from '@/types/advertisement';
import { ServiceHeader } from './services/ServiceHeader';
import { ServiceCard } from './services/ServiceCard';
import { ServiceFeatures } from './services/ServiceFeatures';
import { ContactSection } from './services/ContactSection';
import { EmptyServicesState } from './services/EmptyServicesState';

interface ServicesViewProps {
  advertisements: Advertisement[];
}

export const ServicesView = ({ advertisements }: ServicesViewProps) => {
  return (
    <div className="space-y-8">
      <ServiceHeader />

      {advertisements && advertisements.length > 0 ? (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Serviços Disponíveis</h2>
            <div className="h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map((ad) => (
              <ServiceCard key={ad.id} advertisement={ad} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyServicesState />
      )}

      <ServiceFeatures />
      <ContactSection />
    </div>
  );
};
