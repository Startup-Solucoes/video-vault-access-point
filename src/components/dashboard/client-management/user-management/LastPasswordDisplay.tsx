
import React from 'react';
import { Key, Eye, EyeOff, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LastPasswordDisplayProps {
  lastUpdatedPassword: string;
  showLastPassword: boolean;
  onTogglePasswordVisibility?: () => void;
  onCopyLastPassword?: () => void;
}

export const LastPasswordDisplay = ({
  lastUpdatedPassword,
  showLastPassword,
  onTogglePasswordVisibility,
  onCopyLastPassword
}: LastPasswordDisplayProps) => {
  return (
    <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Última senha alterada:</span>
          <code className="text-sm bg-white px-2 py-1 rounded border">
            {showLastPassword ? lastUpdatedPassword : '••••••••••'}
          </code>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePasswordVisibility}
            className="h-8 w-8 p-0"
            title={showLastPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showLastPassword ? (
              <EyeOff className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopyLastPassword}
            className="h-8 w-8 p-0"
            title="Copiar senha"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
