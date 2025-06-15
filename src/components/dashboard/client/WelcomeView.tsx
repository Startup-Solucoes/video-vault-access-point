
import React from 'react';
import { Database } from '@/integrations/supabase/types';
import { ClientVideo } from '@/types/clientVideo';
import { HeroSection } from './welcome/HeroSection';
import { StatsCards } from './welcome/StatsCards';
import { RecentVideos } from './welcome/RecentVideos';
import { AccountInfo } from './welcome/AccountInfo';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface WelcomeViewProps {
  profile: Profile;
  videos: ClientVideo[];
  onNavigateToVideos: () => void;
  onNavigateToServices: () => void;
}

export const WelcomeView = ({
  profile,
  videos,
  onNavigateToVideos,
  onNavigateToServices
}: WelcomeViewProps) => {
  const recentVideos = videos.slice(0, 3);
  const totalVideos = videos.length;
  const categories = [...new Set(videos.map(v => v.category).filter(Boolean))].length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <HeroSection 
        profile={profile}
        onNavigateToVideos={onNavigateToVideos}
        onNavigateToServices={onNavigateToServices}
      />

      <StatsCards 
        totalVideos={totalVideos}
        categories={categories}
        onNavigateToVideos={onNavigateToVideos}
        onNavigateToServices={onNavigateToServices}
      />

      <RecentVideos 
        videos={recentVideos}
        onNavigateToVideos={onNavigateToVideos}
      />

      <AccountInfo profile={profile} />
    </div>
  );
};
