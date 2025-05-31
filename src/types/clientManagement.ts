
export interface ClientFilters {
  searchTerm: string;
  activeTab: 'all' | 'verified' | 'unverified' | 'deleted';
}

export interface ClientCounts {
  all: number;
  verified: number;
  unverified: number;
  deleted: number;
}
