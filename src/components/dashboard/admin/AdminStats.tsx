
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Video, BarChart3, Eye } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalClients?: number;
    activeClients?: number;
    totalVideos?: number;
    videosThisMonth?: number;
    totalViews?: number;
    viewsThisMonth?: number;
  };
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total de Clientes</CardTitle>
          <Users className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalClients || 0}</div>
          <p className="text-xs opacity-80 mt-1">Registrados no sistema</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Clientes Ativos</CardTitle>
          <Users className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.activeClients || 0}</div>
          <p className="text-xs opacity-80 mt-1">Com acesso a vídeos</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total de Vídeos</CardTitle>
          <Video className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalVideos || 0}</div>
          <p className="text-xs opacity-80 mt-1">Disponíveis na plataforma</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Vídeos Este Mês</CardTitle>
          <BarChart3 className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.videosThisMonth || 0}</div>
          <p className="text-xs opacity-80 mt-1">Criados recentemente</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Visualizações</CardTitle>
          <Eye className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalViews || 0}</div>
          <p className="text-xs opacity-80 mt-1">Visualizações válidas</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Views Este Mês</CardTitle>
          <Eye className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.viewsThisMonth || 0}</div>
          <p className="text-xs opacity-80 mt-1">Visualizações recentes</p>
        </CardContent>
      </Card>
    </div>
  );
};
