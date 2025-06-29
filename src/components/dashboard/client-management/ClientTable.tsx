
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Edit2, 
  Trash2, 
  CheckCircle,
  User,
  Mail
} from 'lucide-react';
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
  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Nenhum administrador encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {client.logo_url && (
                    <img
                      src={client.logo_url}
                      alt={`Logo ${client.full_name}`}
                      className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                    />
                  )}
                  <div>
                    <div className="font-medium">{client.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      ID: {client.id.slice(0, 8)}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {client.email}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={client.role === 'approved' ? 'default' : 'secondary'}
                  className={client.role === 'approved' ? 
                    'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }
                >
                  {client.role === 'approved' ? 'Aprovado' : 'Pendente'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditClient(client)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  {client.role !== 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApproveClient(client.id, client.email)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteClient(client.id, client.full_name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
