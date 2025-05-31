
export interface ClientFilters {
  searchTerm: string;
  activeTab: 'all' | 'verified' | 'unverified';
}

export interface ClientCounts {
  all: number;
  verified: number;
  unverified: number;
}
