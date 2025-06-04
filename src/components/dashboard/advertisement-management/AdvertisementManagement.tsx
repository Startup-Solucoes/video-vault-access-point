
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AdvertisementForm } from '@/components/forms/AdvertisementForm';
import { AdvertisementList } from './AdvertisementList';
import { useAdvertisements } from '@/hooks/useAdvertisements';

export const AdvertisementManagement = () => {
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gerenciamento de Anúncios</CardTitle>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Anúncio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AdvertisementList
            advertisements={advertisements}
            isLoading={isLoading}
            onEdit={handleEdit}
            onRefresh={refreshAdvertisements}
          />
        </CardContent>
      </Card>

      <AdvertisementForm
        open={showForm}
        onOpenChange={setShowForm}
        advertisementId={editingAdvertisementId}
        onAdvertisementCreated={handleAdvertisementCreated}
      />
    </div>
  );
};
