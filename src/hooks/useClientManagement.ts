
import { useClientData } from './useClientData';
import { useClientFilters } from './useClientFilters';

export const useClientManagement = () => {
  const {
    clients,
    isLoading,
    refreshClients,
    updateClient,
    approveClient,
    deleteClient
  } = useClientData();

  const {
    filteredClients,
    searchTerm,
    setSearchTerm
  } = useClientFilters(clients);

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    isLoading,
    refreshClients,
    updateClient,
    approveClient,
    deleteClient
  };
};
