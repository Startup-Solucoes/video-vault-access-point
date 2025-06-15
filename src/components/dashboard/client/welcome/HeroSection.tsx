
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface HeroSectionProps {
  profile: Profile;
  onNavigateToVideos: () => void;
  onNavigateToServices: () => void;
}

export const HeroSection = ({ profile, onNavigateToVideos, onNavigateToServices }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-2xl p-8 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-zinc-900"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
            <h1 className="text-3xl font-bold">
              Bem-vindo de volta, <span className="text-yellow-300">{profile.full_name}!</span>
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl">
            Seu portal de conteúdo personalizado está pronto. Explore seus vídeos, 
            descubra novos recursos e aproveite a experiência premium.
          </p>
          <div className="flex gap-4 pt-4">
            <Button onClick={onNavigateToVideos} className="bg-white hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all text-zinc-900">
              <Play className="h-5 w-5 mr-2" />
              Explorar Vídeos
            </Button>
            <Button onClick={onNavigateToServices} variant="outline" className="border-white/30 text-white font-semibold px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400">
              <Star className="h-5 w-5 mr-2" />
              Ver Serviços
            </Button>
          </div>
        </div>
        
        {profile.logo_url && (
          <div className="hidden lg:block">
            <img 
              src={profile.logo_url} 
              alt={`Logo ${profile.full_name}`} 
              className="h-24 w-24 object-contain rounded-2xl bg-white/10 p-4 backdrop-blur-sm" 
            />
          </div>
        )}
      </div>
    </div>
  );
};
