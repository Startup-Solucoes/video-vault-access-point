
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
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');

    const fetchClients = async () => {
      console.log('=== BUSCANDO CLIENTES NO SELECTOR ===');
      setIsLoading(true);
      try {
        // Buscar tanto admins quanto clientes
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, role')
          .in('role', ['client', 'admin'])
          .order('full_name');

        if (error) {
          console.error('Erro na query de clientes:', error);
          throw error;
        }
        
        console.log('Clientes encontrados na base (incluindo admins):', data);
        console.log('Quantidade total:', data?.length || 0);
        
        // Processar os dados para garantir que temos nomes válidos
        const processedClients = (data || []).map(client => ({
          id: client.id,
          full_name: client.full_name || client.email.split('@')[0] || 'Usuário',
          email: client.email
        }));
        
        console.log('Clientes processados:', processedClients);
        setClients(processedClients);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Filtrar clientes baseado no valor de busca
    const filteredClients = React.useMemo(() => {
      console.log('=== FILTRANDO CLIENTES ===');
      console.log('Termo de busca:', searchValue);
      console.log('Total de clientes antes do filtro:', clients.length);
      
      if (!searchValue.trim()) {
        console.log('Sem termo de busca, retornando todos os clientes');
        return clients;
      }
      
      const searchLower = searchValue.toLowerCase().trim();
      const filtered = clients.filter(client => {
        const nameMatch = client.full_name.toLowerCase().includes(searchLower);
        const emailMatch = client.email.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch;
      });
      
      console.log('Clientes após filtro:', filtered.length);
      console.log('Clientes filtrados:', filtered.map(c => c.full_name));
      return filtered;
    }, [clients, searchValue]);

    // Expor função para refresh via ref
    useImperativeHandle(ref, () => ({
      refreshClients: fetchClients
    }));

    useEffect(() => {
      console.log('=== COMPONENTE MONTADO - BUSCANDO CLIENTES ===');
      fetchClients();
    }, []);

    const handleClientSelect = (clientId: string) => {
      console.log('Cliente selecionado:', clientId);
      const newSelection = selectedClients.includes(clientId)
        ? selectedClients.filter(id => id !== clientId)
        : [...selectedClients, clientId];
      
      console.log('Nova seleção de clientes:', newSelection);
      onClientChange(newSelection);
    };

    const removeClient = (clientId: string) => {
      console.log('Removendo cliente:', clientId);
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
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Digite o nome ou e-mail..." 
                value={searchValue}
                onValueChange={(value) => {
                  console.log('=== VALOR DE BUSCA ALTERADO ===');
                  console.log('Novo valor:', value);
                  setSearchValue(value);
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
                      value={client.id}
                      onSelect={() => handleClientSelect(client.id)}
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
