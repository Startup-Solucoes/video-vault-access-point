
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Calendar, TrendingUp, Video } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useVideoViews, useVideoViewStats } from '@/hooks/useVideoViews';

export const VideoViewsManager = () => {
  const { data: views, isLoading: viewsLoading } = useVideoViews();
  const { data: stats, isLoading: statsLoading } = useVideoViewStats();

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (viewsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando visualizações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalValidViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Visualizações válidas (≥ 20 segundos)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vídeos Assistidos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uniqueVideosWatched || 0}</div>
            <p className="text-xs text-muted-foreground">
              Vídeos únicos visualizados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Vídeo</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.uniqueVideosWatched ? Math.round((stats.totalValidViews / stats.uniqueVideosWatched) * 10) / 10 : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Visualizações por vídeo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vídeos Mais Assistidos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Vídeos Mais Assistidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.topVideos?.map((video, index) => (
              <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="min-w-[2rem] justify-center">
                    #{index + 1}
                  </Badge>
                  <div>
                    <h4 className="font-medium">{video.title}</h4>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="font-semibold">{video.view_count || 0}</span>
                </div>
              </div>
            ))}
            {(!stats?.topVideos || stats.topVideos.length === 0) && (
              <p className="text-center text-gray-500 py-8">
                Nenhuma visualização registrada ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Visualizações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Visualizações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {views?.slice(0, 10).map((view) => (
              <div key={view.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium truncate">{view.video_title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(view.viewed_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                    <span>{view.user_email}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {formatDuration(view.watch_duration)}
                  </Badge>
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
              </div>
            ))}
            {(!views || views.length === 0) && (
              <p className="text-center text-gray-500 py-8">
                Nenhuma visualização registrada ainda
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
