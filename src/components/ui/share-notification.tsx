
import React from 'react';
import { Check, Share2 } from 'lucide-react';

interface ShareNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ShareNotification = ({ isVisible, onClose }: ShareNotificationProps) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2">
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
        <Check className="h-4 w-4" />
        <span className="text-sm font-medium">Link copiado para área de transferência!</span>
      </div>
    </div>
  );
};
