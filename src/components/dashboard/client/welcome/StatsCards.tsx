
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, TrendingUp, Star, ArrowRight } from 'lucide-react';

interface StatsCardsProps {
  totalVideos: number;
  categories: number;
  onNavigateToVideos: () => void;
  onNavigateToServices: () => void;
}

export const StatsCards = ({ totalVideos, categories, onNavigateToVideos, onNavigateToServices }: StatsCardsProps) => {
  return (
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
          <CardTitle className="text-sm font-medium text-purple-700">Acesso a dashboard videos</CardTitle>
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
  );
};
