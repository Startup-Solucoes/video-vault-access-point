import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AdminStats } from './AdminStats';
import { AdminQuickActions } from './AdminQuickActions';
interface AdminOverviewProps {
  stats?: any;
  onVideoFormOpen: () => void;
  onClientFormOpen: () => void;
  onTabChange: (tab: string) => void;
}
export const AdminOverview = ({
  stats,
  onVideoFormOpen,
  onClientFormOpen,
  onTabChange
}: AdminOverviewProps) => {
  return <div className="space-y-6">
      {/* Header com ações rápidas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">
              Gerencie vídeos, clientes e visualize estatísticas do sistema
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={onVideoFormOpen} className="text-white shadow-md bg-gray-700 hover:bg-gray-600">
              <Plus className="mr-2 h-4 w-4" />
              Novo Vídeo
            </Button>
            <Button variant="outline" onClick={onClientFormOpen} className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <AdminStats stats={stats} />

      {/* Resumo e ações rápidas */}
      <AdminQuickActions stats={stats} onTabChange={onTabChange} />
    </div>;
};