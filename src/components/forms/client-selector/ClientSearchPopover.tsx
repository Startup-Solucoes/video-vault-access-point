
import React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Client } from './ClientSelectorTypes';

interface ClientSearchPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClients: string[];
  filteredClients: Client[];
  clients: Client[];
  isLoading: boolean;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onClientSelect: (clientId: string) => void;
}

export const ClientSearchPopover: React.FC<ClientSearchPopoverProps> = ({
  open,
  onOpenChange,
  selectedClients,
  filteredClients,
  clients,
  isLoading,
  searchValue,
  onSearchValueChange,
  onClientSelect
}) => {
  const getSelectedClientsDisplay = () => {
    if (selectedClients.length === 0) return "Selecionar clientes...";
    if (selectedClients.length === 1) {
      const client = clients.find(c => c.id === selectedClients[0]);
      return client?.full_name || "Cliente selecionado";
    }
    return `${selectedClients.length} clientes selecionados`;
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {getSelectedClientsDisplay()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Digite o nome ou e-mail..."
            value={searchValue}
            onChange={(e) => {
              console.log('=== VALOR DE BUSCA ALTERADO ===');
              console.log('Novo valor:', e.target.value);
              onSearchValueChange(e.target.value);
            }}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="py-6 text-center text-sm">
              Carregando clientes...
            </div>
          ) : clients.length === 0 ? (
            <div className="py-6 text-center text-sm">
              Nenhum cliente cadastrado ainda.
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-6 text-center text-sm">
              Nenhum cliente encontrado com esse termo.
            </div>
          ) : (
            <div className="p-1">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    console.log('=== CLIENTE SELECIONADO NO POPOVER ===');
                    console.log('Cliente:', client);
                    onClientSelect(client.id);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedClients.includes(client.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{client.full_name}</span>
                    <span className="text-sm text-gray-500">{client.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
