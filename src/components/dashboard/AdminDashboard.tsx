
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Video, Shield, Plus, ArrowLeft } from 'lucide-react';
import { VideoForm } from '@/components/forms/VideoForm';
import { ClientForm } from '@/components/forms/ClientForm';
import { ClientSelectorRef } from '@/components/forms/ClientSelector';
import { ClientManagement } from './ClientManagement';
import { VideoHistory } from './VideoHistory';
import { VideoManagement } from './VideoManagement';

export const AdminDashboard = () => {
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [showClientManagement, setShowClientManagement] = useState(false);
  const [showVideoManagement, setShowVideoManagement] = useState(false);
  const clientSelectorRef = useRef<ClientSelectorRef>(null);

  const handleClientCreated = () => {
    // Atualizar lista de clientes no seletor quando um novo cliente for criado
    console.log('Cliente criado, atualizando lista...');
    if (clientSelectorRef.current) {
      clientSelectorRef.current.refreshClients();
    }
  };

  // Se estiver visualizando o gerenciamento de clientes, mostrar apenas esse componente
  if (showClientManagement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowClientManagement(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
        <ClientManagement />
      </div>
    );
  }

  // Se estiver visualizando o gerenciamento de vídeos, mostrar apenas esse componente
  if (showVideoManagement) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowVideoManagement(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
        <VideoManagement />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Painel Administrativo</h2>
          <p className="text-gray-600">Gerencie usuários, vídeos e permissões</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vídeos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Vídeos cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Permissões Ativas</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Acessos concedidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Clientes</CardTitle>
            <CardDescription>
              Criar e gerenciar contas de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => setIsClientFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Cliente
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowClientManagement(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Ver Todos os Clientes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Vídeos</CardTitle>
            <CardDescription>
              Adicionar e organizar conteúdo de vídeo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                className="w-full"
                onClick={() => setIsVideoFormOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Novo Vídeo
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowVideoManagement(true)}
              >
                <Video className="h-4 w-4 mr-2" />
                Ver Todos os Vídeos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nova seção: Histórico de Vídeos */}
      <VideoHistory limit={10} />

      <VideoForm 
        open={isVideoFormOpen} 
        onOpenChange={setIsVideoFormOpen}
      />
      
      <ClientForm 
        open={isClientFormOpen} 
        onOpenChange={setIsClientFormOpen}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
};
