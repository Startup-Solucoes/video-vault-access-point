
export interface ClientFilters {
  searchTerm: string;
  activeTab: 'all' | 'admins' | 'clients' | 'unverified' | 'deleted';
}

export interface ClientCounts {
  all: number;
  admins: number;
  clients: number;
  unverified: number;
  deleted: number;
}
