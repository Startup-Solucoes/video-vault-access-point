
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Advertisement } from '@/types/advertisement';
import { useToast } from '@/hooks/use-toast';

export const useClientAdvertisements = (clientId: string) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClientAdvertisements = async () => {
    if (!clientId) return;

    console.log('🔍 Buscando anúncios para o cliente:', clientId);
    setIsLoading(true);

    try {
      // Buscar anúncios ativos que são globais OU específicos para este cliente
      const { data: ads, error } = await supabase
        .from('advertisements')
        .select(`
          *,
          advertisement_permissions!left (client_id)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erro ao buscar anúncios do cliente:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar anúncios",
          variant: "destructive",
        });
        return;
      }

      // Filtrar anúncios que são globais (sem permissões) ou específicos para este cliente
      const clientAds = ads?.filter(ad => {
        const permissions = ad.advertisement_permissions || [];
        
        // Se não há permissões, é um anúncio global
        if (permissions.length === 0) {
          return true;
        }
        
        // Se há permissões, verificar se este cliente está incluído
        return permissions.some(p => p.client_id === clientId);
      }) || [];

      console.log('✅ Anúncios do cliente carregados:', clientAds);
      setAdvertisements(clientAds);
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
    fetchClientAdvertisements();
  }, [clientId]);

  const refreshAdvertisements = () => {
    fetchClientAdvertisements();
  };

  return {
    advertisements,
    isLoading,
    refreshAdvertisements
  };
};
