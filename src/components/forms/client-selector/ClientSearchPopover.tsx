
import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
        <Command>
          <CommandInput 
            placeholder="Digite o nome ou e-mail..." 
            value={searchValue}
            onValueChange={(value) => {
              console.log('=== VALOR DE BUSCA ALTERADO ===');
              console.log('Novo valor:', value);
              onSearchValueChange(value);
            }}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading 
                ? "Carregando clientes..." 
                : clients.length === 0 
                  ? "Nenhum cliente cadastrado ainda." 
                  : filteredClients.length === 0
                    ? "Nenhum cliente encontrado com esse termo."
                    : "Carregando..."
              }
            </CommandEmpty>
            <CommandGroup>
              {filteredClients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.full_name} ${client.email}`}
                  onSelect={() => {
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
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
