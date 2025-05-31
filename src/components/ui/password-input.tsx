
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, RefreshCw, Copy } from 'lucide-react';
import { generateStrongPassword, validatePasswordStrength } from '@/utils/passwordGenerator';
import { toast } from '@/hooks/use-toast';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showGenerator?: boolean;
  showStrengthIndicator?: boolean;
  required?: boolean;
  id?: string;
}

export const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "••••••••",
  showGenerator = false,
  showStrengthIndicator = true,
  required = false,
  id
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const passwordValidation = validatePasswordStrength(value);

  const handleGeneratePassword = () => {
    const newPassword = generateStrongPassword(12);
    onChange(newPassword);
    toast({
      title: "Senha gerada!",
      description: "Uma senha forte foi gerada automaticamente",
    });
  };

  const handleCopyPassword = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
        toast({
          title: "Copiado!",
          description: "Senha copiada para a área de transferência",
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível copiar a senha",
          variant: "destructive"
        });
      }
    }
  };

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Fraca';
    if (score <= 3) return 'Média';
    return 'Forte';
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="pr-20"
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {showGenerator && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleGeneratePassword}
                title="Gerar senha forte"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleCopyPassword}
                  title="Copiar senha"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {showStrengthIndicator && value && (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordValidation.score)}`}
                style={{ width: `${(passwordValidation.score / 5) * 100}%` }}
              ></div>
            </div>
            <span className={`text-xs font-medium ${passwordValidation.isStrong ? 'text-green-600' : 'text-yellow-600'}`}>
              {getStrengthText(passwordValidation.score)}
            </span>
          </div>
          {passwordValidation.feedback.length > 0 && (
            <div className="text-xs text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                {passwordValidation.feedback.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
