
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
      const { data: ads, error } = await supabase
        .from('advertisements')
        .select('*')
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

      console.log('✅ Anúncios do cliente carregados:', ads);
      setAdvertisements(ads || []);
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
