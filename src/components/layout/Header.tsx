import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ResetPasswordButton } from './ResetPasswordButton';
export const Header = () => {
  const {
    profile,
    signOut
  } = useAuth();
  return <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/f64ca7e7-2b45-40b3-acdf-ee8120b53523.png" alt="Start Up Soluções Digitais" className="h-10 w-auto" />
            <div className="h-8 w-px bg-gray-300"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-slate-800">Painel de controle</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{profile?.full_name}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {profile?.role === 'admin' ? 'Admin' : 'Cliente'}
              </span>
            </div>
            <ResetPasswordButton />
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>;
};