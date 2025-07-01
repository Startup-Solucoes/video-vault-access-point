
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  Users, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  DollarSign
} from 'lucide-react';
import { AdvertisementWithPermissions } from '@/types/advertisement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdvertisementPermissionsDialog } from './AdvertisementPermissionsDialog';

interface AdvertisementListProps {
  advertisements: AdvertisementWithPermissions[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

export const AdvertisementList = ({ 
  advertisements, 
  isLoading, 
  onEdit, 
  onRefresh 
}: AdvertisementListProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [permissionsDialogId, setPermissionsDialogId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    setDeletingId(id);
    console.log('🗑️ Deletando anúncio:', { id, title });

    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao deletar anúncio:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar anúncio",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Anúncio deletado com sucesso');
      toast({
        title: "Sucesso",
        description: `Anúncio "${title}" deletado com sucesso`,
      });

      onRefresh();
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao deletar anúncio",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('❌ Erro ao alterar status:', error);
        toast({
          title: "Erro",
          description: "Erro ao alterar status do anúncio",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: `Anúncio ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });

      onRefresh();
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao alterar status",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (advertisements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum anúncio cadastrado</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advertisements.map((ad) => (
          <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                    {ad.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={ad.is_active ? "default" : "secondary"}>
                      {ad.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {ad.client_count === 0 ? 'Global' : `${ad.client_count}`}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Imagem do anúncio com proporção 1:1 */}
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {ad.image_url ? (
                  <img 
                    src={ad.image_url} 
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                      }
                    }}
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                )}
              </div>

              {/* Descrição */}
              {ad.description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {ad.description}
                </p>
              )}

              {/* Preço */}
              {ad.price && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-800">
                    {formatPrice(ad.price)}
                  </span>
                </div>
              )}

              {/* Link */}
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-3 w-3 text-blue-600" />
                <a 
                  href={ad.link_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs truncate flex-1"
                >
                  {ad.link_url}
                </a>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPermissionsDialogId(ad.id)}
                    className="h-8"
                  >
                    <Users className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(ad.id, ad.is_active)}
                    className="h-8"
                  >
                    {ad.is_active ? (
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
                    onClick={() => onEdit(ad.id)}
                    className="h-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ad.id, ad.title)}
                    disabled={deletingId === ad.id}
                    className="h-8 text-red-600 hover:text-red-700"
                  >
                    {deletingId === ad.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {permissionsDialogId && (
        <AdvertisementPermissionsDialog
          advertisementId={permissionsDialogId}
          open={!!permissionsDialogId}
          onOpenChange={(open) => !open && setPermissionsDialogId(null)}
          onPermissionsUpdated={onRefresh}
        />
      )}
    </>
  );
};
