
import React from 'react';

interface AdvertisementListStatesProps {
  isLoading?: boolean;
  isEmpty?: boolean;
}

export const LoadingState = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

export const EmptyState = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">Nenhum anúncio cadastrado</p>
  </div>
);
