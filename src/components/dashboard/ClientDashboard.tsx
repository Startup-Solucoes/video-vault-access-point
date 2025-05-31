
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Clock, Filter, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useClientVideos } from '@/hooks/useClientVideos';
import { categories } from '@/components/forms/video-form/VideoFormTypes';

export const ClientDashboard = () => {
  const { profile } = useAuth();
  const { videos, isLoading } = useClientVideos(profile?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Filtrar vídeos baseado na busca e categoria
  const filteredVideos = useMemo(() => {
    let filtered = videos;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }

    return filtered;
  }, [videos, searchTerm, selectedCategory]);

  // Obter categorias disponíveis dos vídeos do cliente
  const availableCategories = useMemo(() => {
    const videoCategories = videos
      .map(video => video.category)
      .filter(category => category !== null && category !== undefined) as string[];
    
    return [...new Set(videoCategories)].sort();
  }, [videos]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com informações do cliente */}
      <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm border">
        {profile.logo_url ? (
          <img 
            src={profile.logo_url} 
            alt={`Logo ${profile.full_name}`}
            className="h-16 w-16 object-contain rounded-lg border"
          />
        ) : (
          <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
          <p className="text-gray-600">{profile.email}</p>
          <div className="flex items-center mt-2 space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Video className="h-3 w-3" />
              <span>{videos.length} vídeo{videos.length !== 1 ? 's' : ''} disponível{videos.length !== 1 ? 'eis' : ''}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input 
              placeholder="Buscar vídeos..." 
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>

          {/* Filtros por categoria */}
          {availableCategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Filtrar por Categoria:</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('')}
                >
                  Todas ({videos.length})
                </Button>
                {availableCategories.map((category) => {
                  const count = videos.filter(v => v.category === category).length;
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Vídeos */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">
                {searchTerm || selectedCategory ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo disponível'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchTerm || selectedCategory 
                  ? 'Tente ajustar os filtros de busca para encontrar outros vídeos.'
                  : 'Seus vídeos aparecerão aqui quando o administrador conceder acesso.'
                }
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {searchTerm || selectedCategory ? 'Nenhum resultado' : 'Aguardando conteúdo'}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center relative">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <Video className="h-12 w-12 text-blue-500" />
                  )}
                  {video.category && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 right-2 bg-white/90"
                    >
                      {video.category}
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(video.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => window.open(video.video_url, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Assistir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
