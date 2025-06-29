import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Video, Megaphone } from 'lucide-react';
interface AdminStatsProps {
  stats: {
    totalClients?: number;
    activeClients?: number;
    totalVideos?: number;
    videosThisMonth?: number;
  };
  onNavigateToClients?: () => void;
  onNavigateToVideos?: () => void;
  onNavigateToAdvertisements?: () => void;
}
export const AdminStats = ({
  stats,
  onNavigateToClients,
  onNavigateToVideos,
  onNavigateToAdvertisements
}: AdminStatsProps) => {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" onClick={onNavigateToClients}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total de Clientes</CardTitle>
          <Users className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalClients || 0}</div>
          <p className="text-xs opacity-80 mt-1">Clique para gerenciar</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" onClick={onNavigateToAdvertisements}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Gerenciar Anúncios</CardTitle>
          <Megaphone className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">Anúncios</div>
          <p className="text-xs opacity-80 mt-1">Clique para gerenciar</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" onClick={onNavigateToVideos}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total de Vídeos</CardTitle>
          <Video className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalVideos || 0}</div>
          <p className="text-xs opacity-80 mt-1">Clique para gerenciar</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Vídeos Este Mês</CardTitle>
          <Video className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.videosThisMonth || 0}</div>
          <p className="text-xs opacity-80 mt-1">Criados recentemente</p>
        </CardContent>
      </Card>
    </div>;
};