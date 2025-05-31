
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClientStatusBadge } from './ClientStatusBadge';
import { ClientActions } from './ClientActions';
import { Client } from '@/types/client';

interface ClientTableProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onApproveClient: (clientId: string, clientEmail: string) => void;
  onDeleteClient: (clientId: string, clientName: string) => void;
}

export const ClientTable = ({ 
  clients, 
  onEditClient, 
  onApproveClient, 
  onDeleteClient 
}: ClientTableProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum cliente encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último acesso</TableHead>
            <TableHead>Cadastrado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  {client.logo_url && (
                    <img
                      src={client.logo_url}
                      alt="Logo"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span>{client.full_name}</span>
                </div>
              </TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>
                <ClientStatusBadge client={client} />
              </TableCell>
              <TableCell>{formatDate(client.last_sign_in_at)}</TableCell>
              <TableCell>{formatDate(client.created_at)}</TableCell>
              <TableCell>
                <ClientActions
                  client={client}
                  onEdit={onEditClient}
                  onApprove={onApproveClient}
                  onDelete={onDeleteClient}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
