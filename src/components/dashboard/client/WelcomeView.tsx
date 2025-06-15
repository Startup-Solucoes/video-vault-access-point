
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Star, Calendar, TrendingUp, Play } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { ClientVideo } from '@/types/clientVideo';

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
    <div className="space-y-6">
      {/* Header de boas-vindas */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo de volta, {profile.full_name}!
            </h1>
            <p className="text-blue-100">
              Aqui está um resumo da sua conta e conteúdo disponível.
            </p>
          </div>
          {profile.logo_url && (
            <img 
              src={profile.logo_url} 
              alt={`Logo ${profile.full_name}`}
              className="h-16 w-16 object-contain rounded-xl bg-white/10 p-2"
            />
          )}
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToVideos}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vídeos</CardTitle>
            <Video className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalVideos}</div>
            <p className="text-xs text-gray-600">
              Vídeos disponíveis para você
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{categories}</div>
            <p className="text-xs text-gray-600">
              Diferentes categorias
            </p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onNavigateToServices}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Serviços</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Premium</div>
            <p className="text-xs text-gray-600">
              Acesso aos serviços
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vídeos recentes */}
      {recentVideos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Vídeos Recentes
              </CardTitle>
              <button 
                onClick={onNavigateToVideos}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todos →
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVideos.map((video) => (
                <div key={video.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="h-12 w-20 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-12 w-20 bg-gray-200 rounded-md flex items-center justify-center">
                      <Video className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{video.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {video.category && (
                        <Badge variant="secondary" className="text-xs">
                          {video.category}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {video.platform}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informações da conta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome</label>
              <p className="text-gray-900">{profile.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge variant="outline" className="text-green-700 border-green-300">
                Ativo
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Último acesso</label>
              <p className="text-gray-900">Hoje</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
