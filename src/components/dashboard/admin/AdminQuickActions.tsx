
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Settings } from 'lucide-react';

interface AdminQuickActionsProps {
  stats: {
    totalClients?: number;
    totalVideos?: number;
    totalPermissions?: number;
  };
  onTabChange: (tab: string) => void;
}

export const AdminQuickActions = ({ stats, onTabChange }: AdminQuickActionsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Resumo do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Clientes Totais</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {stats?.totalClients || 0}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Vídeos Publicados</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {stats?.totalVideos || 0}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Permissões Ativas</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {stats?.totalPermissions || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start border-blue-200 hover:bg-blue-50"
            onClick={() => onTabChange('videos')}
          >
            <Video className="mr-3 h-4 w-4 text-blue-600" />
            Gerenciar Vídeos
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start border-green-200 hover:bg-green-50"
            onClick={() => onTabChange('clients')}
          >
            <Users className="mr-3 h-4 w-4 text-green-600" />
            Gerenciar Administradores
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start border-purple-200 hover:bg-purple-50"
            onClick={() => onTabChange('tools')}
          >
            <Settings className="mr-3 h-4 w-4 text-purple-600" />
            Ferramentas do Sistema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
