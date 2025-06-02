
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordButton } from './ResetPasswordButton';

export const Header = () => {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16 w-full min-w-0">
          {/* Logo e título - lado esquerdo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
            <img 
              src="/lovable-uploads/f64ca7e7-2b45-40b3-acdf-ee8120b53523.png" 
              alt="Start Up Soluções Digitais" 
              className="h-8 sm:h-10 w-auto flex-shrink-0" 
            />
            <div className="hidden sm:block h-8 w-px bg-gray-300 flex-shrink-0"></div>
            <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-slate-800 truncate min-w-0">
              Painel de controle
            </h1>
          </div>
          
          {/* Informações do usuário e botões - lado direito */}
          <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
            {/* Info do usuário - oculta em telas muito pequenas */}
            <div className="hidden md:flex items-center space-x-2 min-w-0">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate max-w-32 lg:max-w-none">
                {profile?.full_name}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap">
                {profile?.role === 'admin' ? 'Admin' : 'Cliente'}
              </span>
            </div>
            
            {/* Botões de ação */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <ResetPasswordButton />
              <Button variant="outline" size="sm" onClick={signOut} className="text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
