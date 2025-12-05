import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface VideoTableHeaderProps {
  allSelected: boolean;
  onSelectAllVisible: () => void;
}

export const VideoTableHeader = ({ allSelected, onSelectAllVisible }: VideoTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAllVisible}
          />
        </TableHead>
        <TableHead className="w-16">#</TableHead>
        <TableHead className="min-w-[250px]">Título</TableHead>
        <TableHead className="w-40">Categoria</TableHead>
        <TableHead className="w-44">Data de Criação</TableHead>
        <TableHead className="w-40">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
};