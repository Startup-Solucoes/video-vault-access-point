
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Video, ArrowRight } from 'lucide-react';
import { ClientVideo } from '@/types/clientVideo';

interface RecentVideosProps {
  videos: ClientVideo[];
  onNavigateToVideos: () => void;
}

export const RecentVideos = ({ videos, onNavigateToVideos }: RecentVideosProps) => {
  if (videos.length === 0) return null;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-900">
              <Play className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Vídeos Recentes</h3>
              <p className="text-sm text-gray-500 font-normal">Últimos conteúdos adicionados</p>
            </div>
          </CardTitle>
          <Button onClick={onNavigateToVideos} variant="outline" className="hover:bg-blue-50 hover:text-blue-600">
            Ver todos
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {videos.map(video => (
            <div key={video.id} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-all group">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title} 
                  className="h-16 w-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow" 
                />
              ) : (
                <div className="h-16 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
                  <Video className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center gap-3 mt-2">
                  {video.category && (
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {video.category}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {video.platform}
                  </span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
