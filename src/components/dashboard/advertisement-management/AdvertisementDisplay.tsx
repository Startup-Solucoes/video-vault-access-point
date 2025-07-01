
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AdvertisementForm } from '@/components/forms/AdvertisementForm';
import { AdvertisementList } from './AdvertisementList';
import { useAdvertisements } from '@/hooks/useAdvertisements';

export const AdvertisementDisplay = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAdvertisementId, setEditingAdvertisementId] = useState<string | undefined>();
  const { advertisements, isLoading, refreshAdvertisements } = useAdvertisements();

  const handleCreateNew = () => {
    setEditingAdvertisementId(undefined);
    setShowForm(true);
  };

  const handleEdit = (advertisementId: string) => {
    setEditingAdvertisementId(advertisementId);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAdvertisementId(undefined);
  };

  const handleAdvertisementCreated = () => {
    refreshAdvertisements();
    handleFormClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium text-gray-900">Anúncios Ativos</h4>
          <p className="text-sm text-gray-600">
            Gerencie os anúncios exibidos para os clientes
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Anúncio
        </Button>
      </div>

      <AdvertisementList
        advertisements={advertisements}
        isLoading={isLoading}
        onEdit={handleEdit}
        onRefresh={refreshAdvertisements}
      />

      <AdvertisementForm
        open={showForm}
        onOpenChange={setShowForm}
        advertisementId={editingAdvertisementId}
        onAdvertisementCreated={handleAdvertisementCreated}
      />
    </div>
  );
};
