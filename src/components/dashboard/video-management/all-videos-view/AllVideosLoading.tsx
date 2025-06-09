
import React from 'react';

export const AllVideosLoading = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">Carregando vídeos...</span>
      </div>
    </div>
  );
};
