
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
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Resumo do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900">
            <span className="text-sm font-medium text-foreground">Clientes Totais</span>
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {stats?.totalClients || 0}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-100 dark:border-green-900">
            <span className="text-sm font-medium text-foreground">Vídeos Publicados</span>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              {stats?.totalVideos || 0}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-100 dark:border-purple-900">
            <span className="text-sm font-medium text-foreground">Permissões Ativas</span>
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              {stats?.totalPermissions || 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-foreground"
            onClick={() => onTabChange('videos')}
          >
            <Video className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
            Gerenciar Vídeos
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-950 text-foreground"
            onClick={() => onTabChange('clients')}
          >
            <Users className="mr-3 h-4 w-4 text-green-600 dark:text-green-400" />
            Gerenciar Administradores
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950 text-foreground"
            onClick={() => onTabChange('tools')}
          >
            <Settings className="mr-3 h-4 w-4 text-purple-600 dark:text-purple-400" />
            Ferramentas do Sistema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
