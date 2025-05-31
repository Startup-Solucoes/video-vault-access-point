
export interface ClientFilters {
  searchTerm: string;
  activeTab: 'all' | 'admins' | 'clients' | 'verified' | 'unverified' | 'deleted';
}

export interface ClientCounts {
  all: number;
  admins: number;
  clients: number;
  verified: number;
  unverified: number;
  deleted: number;
}
