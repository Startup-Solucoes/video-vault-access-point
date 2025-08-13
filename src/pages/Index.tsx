
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AuthForm } from "@/components/auth/AuthForm";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoModal } from "@/components/ui/video-modal";

const AppContent = () => {
  const { user, profile, isLoading } = useAuth();
  const [sharedVideo, setSharedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  console.log('App render state:', { user: !!user, profile, isLoading });

  // Check for shared video URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    
    if (videoId && user) {
      // Fetch video data
      const fetchSharedVideo = async () => {
        try {
          const { data: video, error } = await supabase
            .from('videos')
            .select('id, title, description, video_url, category, created_at')
            .eq('id', videoId)
            .single();

          if (!error && video) {
            setSharedVideo(video);
            setIsVideoModalOpen(true);
            
            // Clean up URL without reloading the page
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          }
        } catch (err) {
          console.error('Error fetching shared video:', err);
        }
      };

      fetchSharedVideo();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <div className="min-h-screen w-full bg-transparent">
      <AuthForm onSuccess={() => {}} />
    </div>;
  }

  return (
    <>
      <Dashboard />
      {sharedVideo && (
        <VideoModal
          open={isVideoModalOpen}
          onOpenChange={setIsVideoModalOpen}
          video={sharedVideo}
        />
      )}
    </>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
