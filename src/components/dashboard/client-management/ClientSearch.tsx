
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ClientSearch = ({ searchTerm, onSearchChange }: ClientSearchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Search className="h-4 w-4 text-gray-400" />
      <Input
        placeholder="Buscar por nome ou email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
