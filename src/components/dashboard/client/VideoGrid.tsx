
import React from 'react';
import { VideoCard } from './VideoCard';
import { ClientVideo } from '@/types/clientVideo';
import { Video, Search } from 'lucide-react';

interface VideoGridProps {
  videos: ClientVideo[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
}

export const VideoGrid = ({ videos, isLoading, searchTerm, selectedCategory }: VideoGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Carregando vídeos...</span>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    const isFiltered = searchTerm || selectedCategory;
    
    return (
      <div className="text-center py-16">
        {isFiltered ? (
          <>
            <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum vídeo encontrado
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Não encontramos vídeos que correspondam aos filtros aplicados. 
              Tente ajustar os termos de busca ou filtros.
            </p>
          </>
        ) : (
          <>
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum vídeo disponível
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Ainda não há vídeos disponíveis para sua conta. 
              Entre em contato conosco para adicionar conteúdo.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid responsivo otimizado para full-width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
