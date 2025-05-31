
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
    setSearchTerm,
    activeTab,
    setActiveTab,
    getTabCounts
  } = useClientFilters(clients);

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    isLoading,
    activeTab,
    setActiveTab,
    refreshClients,
    updateClient,
    approveClient,
    deleteClient,
    getTabCounts
  };
};
