
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  Users, 
  Eye,
  EyeOff
} from 'lucide-react';

interface AdvertisementCardActionsProps {
  advertisementId: string;
  advertisementTitle: string;
  isActive: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onManagePermissions: (id: string) => void;
  isDeleting: boolean;
}

export const AdvertisementCardActions = ({
  advertisementId,
  advertisementTitle,
  isActive,
  onEdit,
  onDelete,
  onToggleActive,
  onManagePermissions,
  isDeleting
}: AdvertisementCardActionsProps) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onManagePermissions(advertisementId)}
          className="h-8"
        >
          <Users className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleActive(advertisementId, isActive)}
          className="h-8"
        >
          {isActive ? (
            <EyeOff className="h-3 w-3" />
          ) : (
            <Eye className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(advertisementId)}
          className="h-8"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(advertisementId, advertisementTitle)}
          disabled={isDeleting}
          className="h-8 text-red-600 hover:text-red-700"
        >
          {isDeleting ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
          ) : (
            <Trash2 className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
};
