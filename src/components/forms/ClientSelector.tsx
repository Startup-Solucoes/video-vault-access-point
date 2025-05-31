
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  full_name: string;
  email: string;
}

interface ClientSelectorProps {
  selectedClients: string[];
  onClientChange: (clientIds: string[]) => void;
}

export interface ClientSelectorRef {
  refreshClients: () => void;
}

export const ClientSelector = forwardRef<ClientSelectorRef, ClientSelectorProps>(
  ({ selectedClients, onClientChange }, ref) => {
    const [open, setOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    const fetchClients = async () => {
      console.log('Buscando clientes...');
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('role', 'client')
          .order('full_name');

        if (error) {
          console.error('Erro na query:', error);
          throw error;
        }
        
        console.log('Clientes encontrados:', data);
        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Filtrar clientes baseado na busca
    useEffect(() => {
      if (!searchValue.trim()) {
        setFilteredClients(clients);
        return;
      }

      const filtered = clients.filter(client => 
        client.full_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        client.email.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredClients(filtered);
    }, [searchValue, clients]);

    // Expor função para refresh via ref
    useImperativeHandle(ref, () => ({
      refreshClients: fetchClients
    }));

    useEffect(() => {
      fetchClients();
    }, []);

    const handleClientSelect = (clientId: string) => {
      const newSelection = selectedClients.includes(clientId)
        ? selectedClients.filter(id => id !== clientId)
        : [...selectedClients, clientId];
      
      onClientChange(newSelection);
    };

    const removeClient = (clientId: string) => {
      onClientChange(selectedClients.filter(id => id !== clientId));
    };

    const getSelectedClientsDisplay = () => {
      if (selectedClients.length === 0) return "Selecionar clientes...";
      if (selectedClients.length === 1) {
        const client = clients.find(c => c.id === selectedClients[0]);
        return client?.full_name || "Cliente selecionado";
      }
      return `${selectedClients.length} clientes selecionados`;
    };

    return (
      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
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
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Buscar clientes por nome ou e-mail..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandList>
                <CommandEmpty>
                  {isLoading ? "Carregando..." : filteredClients.length === 0 && clients.length === 0 ? "Nenhum cliente cadastrado ainda." : "Nenhum cliente encontrado."}
                </CommandEmpty>
                <CommandGroup>
                  {filteredClients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={`${client.full_name} ${client.email}`}
                      onSelect={() => handleClientSelect(client.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClients.includes(client.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{client.full_name}</span>
                        <span className="text-sm text-gray-500">{client.email}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedClients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedClients.map((clientId) => {
              const client = clients.find(c => c.id === clientId);
              return (
                <Badge key={clientId} variant="secondary" className="flex items-center gap-1">
                  {client?.full_name || 'Cliente'}
                  <button
                    type="button"
                    onClick={() => removeClient(clientId)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

ClientSelector.displayName = 'ClientSelector';
