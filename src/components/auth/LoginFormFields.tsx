
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormFieldsProps {
  loginData: {
    email: string;
    password: string;
  };
  setLoginData: React.Dispatch<React.SetStateAction<{
    email: string;
    password: string;
  }>>;
}

export const LoginFormFields = ({ loginData, setLoginData }: LoginFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="login-email">E-mail</Label>
        <Input
          id="login-email"
          type="email"
          value={loginData.email}
          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="seu@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <Input
          id="login-password"
          type="password"
          value={loginData.password}
          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
          placeholder="••••••••"
          required
        />
      </div>
    </>
  );
};
