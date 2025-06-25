
import React from 'react';
import { Star } from 'lucide-react';

export const ServiceHeader = () => {
  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <Star className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Nossos Serviços</h1>
          <p className="text-gray-200">
            Descubra nossos serviços exclusivos e ofertas especiais
          </p>
        </div>
      </div>
    </div>
  );
};
