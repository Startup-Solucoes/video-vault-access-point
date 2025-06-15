import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Star, Calendar, TrendingUp, Play, ArrowRight, User, Activity } from 'lucide-react';
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
  return <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
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
          
          {profile.logo_url && <div className="hidden lg:block">
              <img src={profile.logo_url} alt={`Logo ${profile.full_name}`} className="h-24 w-24 object-contain rounded-2xl bg-white/10 p-4 backdrop-blur-sm" />
            </div>}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card onClick={onNavigateToVideos} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 cursor-pointer bg-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total de Vídeos</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
              <Video className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalVideos}</div>
            <p className="text-sm text-blue-600">
              Conteúdo disponível para você
            </p>
            <div className="flex items-center mt-2 text-blue-500">
              <span className="text-xs">Clique para explorar</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Categorias</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{categories}</div>
            <p className="text-sm text-green-600">
              Diferentes tipos de conteúdo
            </p>
            <div className="flex items-center mt-2">
              <Badge variant="secondary" className="bg-green-200 text-green-800 text-xs">
                Diversificado
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 cursor-pointer" onClick={onNavigateToServices}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Acesso Premium</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
              <Star className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">Ativo</div>
            <p className="text-sm text-purple-600">
              Todos os recursos liberados
            </p>
            <div className="flex items-center mt-2 text-purple-500">
              <span className="text-xs">Ver benefícios</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      {recentVideos.length > 0 && <Card className="border-0 shadow-lg">
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
              {recentVideos.map(video => <div key={video.id} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-blue-200 transition-all group">
                  {video.thumbnail_url ? <img src={video.thumbnail_url} alt={video.title} className="h-16 w-24 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow" /> : <div className="h-16 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
                      <Video className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                    </div>}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      {video.category && <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {video.category}
                        </Badge>}
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {video.platform}
                      </span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-5 w-5 text-blue-500" />
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>}

      {/* Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gray-500 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Nome</span>
                <span className="text-gray-900">{profile.full_name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-medium text-gray-600">Email</span>
                <span className="text-gray-900 truncate ml-4">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600">Status</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Activity className="h-3 w-3 mr-1" />
                  Ativo
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Último acesso:</span>
                <span className="font-medium text-gray-900">Hoje</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Vídeos visualizados:</span>
                <span className="font-medium text-gray-900">Esta semana</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Conta criada:</span>
                <span className="font-medium text-gray-900">Cliente ativo</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};