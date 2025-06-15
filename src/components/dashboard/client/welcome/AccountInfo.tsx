
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Activity } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AccountInfoProps {
  profile: Profile;
}

export const AccountInfo = ({ profile }: AccountInfoProps) => {
  return (
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
  );
};
