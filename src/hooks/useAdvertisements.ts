
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Advertisement, AdvertisementWithPermissions } from '@/types/advertisement';
import { useToast } from '@/hooks/use-toast';

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<AdvertisementWithPermissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdvertisements = async () => {
    console.log('🔍 Buscando anúncios...');
    setIsLoading(true);

    try {
      const { data: ads, error } = await supabase
        .from('advertisements')
        .select(`
          *,
          advertisement_permissions (
            id,
            client_id,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar anúncios:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar anúncios",
          variant: "destructive",
        });
        return;
      }

      // Calcular contagem de clientes para cada anúncio
      const adsWithClientCount = ads?.map(ad => ({
        ...ad,
        client_count: ad.advertisement_permissions?.filter(p => p.client_id !== null).length || 0
      })) || [];

      console.log('✅ Anúncios carregados:', adsWithClientCount);
      setAdvertisements(adsWithClientCount);
    } catch (error) {
      console.error('💥 Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar anúncios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const refreshAdvertisements = () => {
    fetchAdvertisements();
  };

  return {
    advertisements,
    isLoading,
    refreshAdvertisements
  };
};
