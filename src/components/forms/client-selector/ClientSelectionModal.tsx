
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Loader2 } from 'lucide-react';
import { Client } from './ClientSelectorTypes';

interface ClientSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  selectedClients: string[];
  onClientToggle: (clientId: string) => void;
  onBulkClientChange: (clientIds: string[]) => void;
  isLoading: boolean;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  filteredClients: Client[];
  onConfirmSelection?: () => void;
  isAssigning?: boolean;
}

export const ClientSelectionModal: React.FC<ClientSelectionModalProps> = ({
  open,
  onOpenChange,
  clients,
  selectedClients,
  onClientToggle,
  onBulkClientChange,
  isLoading,
  searchValue,
  onSearchValueChange,
  filteredClients,
  onConfirmSelection,
  isAssigning = false
}) => {
  const handleSelectAll = () => {
    console.log('=== BOTÃO SELECIONAR TODOS CLICADO ===');
    console.log('Clientes filtrados:', filteredClients.map(c => c.id));
    console.log('Clientes já selecionados:', selectedClients);
    
    const allFilteredSelected = filteredClients.length > 0 && 
      filteredClients.every(client => selectedClients.includes(client.id));
    
    console.log('Todos os filtrados estão selecionados?', allFilteredSelected);
    
    if (allFilteredSelected) {
      // Se todos os filtrados estão selecionados, desmarcar todos os filtrados
      console.log('Desmarcando todos os clientes filtrados');
      const filteredIds = filteredClients.map(c => c.id);
      const newSelection = selectedClients.filter(id => !filteredIds.includes(id));
      console.log('Nova seleção após desmarcar:', newSelection);
      onBulkClientChange(newSelection);
    } else {
      // Selecionar todos os filtrados que ainda não estão selecionados
      console.log('Selecionando todos os clientes filtrados');
      const filteredIds = filteredClients.map(c => c.id);
      // Criar nova lista mantendo os já selecionados e adicionando os novos
      const newSelection = [...new Set([...selectedClients, ...filteredIds])];
      console.log('Nova seleção após selecionar todos:', newSelection);
      onBulkClientChange(newSelection);
    }
  };

  const handleConfirm = () => {
    console.log('=== BOTÃO CONFIRMAR CLICADO ===');
    console.log('Clientes selecionados:', selectedClients);
    
    if (onConfirmSelection) {
      onConfirmSelection();
    } else {
      // Fallback: apenas fechar o modal
      onOpenChange(false);
    }
  };

  const allFilteredSelected = filteredClients.length > 0 && 
    filteredClients.every(client => selectedClients.includes(client.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Selecionar Clientes</DialogTitle>
          <DialogDescription>
            Escolha quais clientes terão acesso aos vídeos selecionados. Você pode selecionar múltiplos clientes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Campo de busca */}
          <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </div>

          {/* Botão Selecionar/Desmarcar Todos */}
          {filteredClients.length > 0 && (
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {allFilteredSelected ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </Button>
              <span className="text-sm text-gray-500">
                {selectedClients.length} de {clients.length} selecionados
              </span>
            </div>
          )}

          {/* Lista de clientes */}
          <div className="border rounded-md max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                Carregando clientes...
              </div>
            ) : clients.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhum cliente cadastrado ainda.
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Nenhum cliente encontrado com esse termo.
              </div>
            ) : (
              <div className="divide-y">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onClientToggle(client.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => onClientToggle(client.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {client.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={selectedClients.length === 0 || isAssigning}
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Atribuindo...
              </>
            ) : (
              `Confirmar Atribuição (${selectedClients.length} cliente${selectedClients.length !== 1 ? 's' : ''})`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
