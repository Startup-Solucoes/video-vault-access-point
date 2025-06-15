
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Video, 
  Users, 
  History, 
  Settings, 
  Menu, 
  X,
  ChevronDown,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordPressLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const WordPressLayout = ({ children, activeTab, onTabChange }: WordPressLayoutProps) => {
  const { profile, signOut } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isAdmin = profile?.role === 'admin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, adminOnly: false },
    { id: 'videos', label: 'Vídeos', icon: Video, adminOnly: true },
    { id: 'clients', label: 'Administradores', icon: Users, adminOnly: true },
    { id: 'history', label: 'Histórico', icon: History, adminOnly: true },
    { id: 'tools', label: 'Ferramentas', icon: Settings, adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={cn(
        "bg-white shadow-lg transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/f64ca7e7-2b45-40b3-acdf-ee8120b53523.png" 
                alt="Logo" 
                className="h-8 w-auto" 
              />
              <h2 className="font-bold text-gray-800 text-sm">Painel Admin</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2"
          >
            {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700" 
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", sidebarCollapsed ? "mx-auto" : "mr-3")} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t">
          {!sidebarCollapsed ? (
            <div className="space-y-3">
              <div className="text-xs text-gray-500">
                <div className="font-medium text-gray-900 truncate">{profile?.full_name}</div>
                <div className="truncate">{profile?.email}</div>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {profile?.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="w-full text-xs"
              >
                Sair
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
              className="w-full p-2"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {filteredMenuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {isAdmin ? 'Painel Administrativo' : 'Portal do Cliente'}
              </p>
            </div>
            
            {/* Breadcrumb ou ações adicionais podem ir aqui */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
