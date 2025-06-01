
import { useCallback } from 'react';
import { useCache } from '@/hooks/useCache';
import { useAuth } from '@/hooks/useAuth';

export const useCacheInvalidation = () => {
  const { user } = useAuth();
  const { invalidatePattern } = useCache();

  const invalidateVideoCache = useCallback(() => {
    console.log('🔄 Invalidando cache de vídeos...');
    invalidatePattern('video_history_');
    invalidatePattern('client_videos_');
    invalidatePattern('video_permissions_');
  }, [invalidatePattern]);

  const invalidateClientCache = useCallback(() => {
    console.log('🔄 Invalidando cache de clientes...');
    invalidatePattern('clients_');
    invalidatePattern('client_videos_');
    invalidatePattern('video_permissions_');
  }, [invalidatePattern]);

  const invalidateUserCache = useCallback((userId?: string) => {
    const targetUserId = userId || user?.id;
    if (targetUserId) {
      console.log(`🔄 Invalidando cache do usuário: ${targetUserId}`);
      invalidatePattern(`_${targetUserId}`);
    }
  }, [invalidatePattern, user]);

  const invalidateAllCache = useCallback(() => {
    console.log('🧹 Invalidando todo o cache...');
    invalidatePattern('.*'); // Regex para todos os padrões
  }, [invalidatePattern]);

  return {
    invalidateVideoCache,
    invalidateClientCache,
    invalidateUserCache,
    invalidateAllCache
  };
};
