
export interface Client {
  id: string;
  full_name: string;
  email: string;
}

export interface ClientSelectorProps {
  selectedClients: string[];
  onClientChange: (clientIds: string[]) => void;
}

export interface ClientSelectorRef {
  refreshClients: () => void;
}
