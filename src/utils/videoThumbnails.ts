
// Função para extrair thumbnail de URLs de vídeo
export const getVideoThumbnail = (videoUrl: string): string | null => {
  if (!videoUrl) return null;

  // ScreenPal - baseado na documentação, as thumbnails seguem um padrão específico
  const screenPalMatch = videoUrl.match(/screenpal\.com\/watch\/([^/?&#]+)/);
  if (screenPalMatch) {
    // ScreenPal thumbnails geralmente seguem o padrão: https://content.screencast.com/users/[user]/folders/[folder]/media/[id]/thumbnails/[id].png
    // Como não temos acesso direto a essa estrutura, vamos tentar construir baseado no ID
    const videoId = screenPalMatch[1];
    return `https://content.screencast.com/media/${videoId}/thumbnail.png`;
  }

  // YouTube
  const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }

  // Vimeo
  const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    // Para Vimeo seria necessário fazer uma chamada à API para obter a thumbnail
    // Por enquanto retornamos null, mas poderia ser implementado futuramente
    return null;
  }

  // Outros provedores podem ser adicionados aqui
  return null;
};

// Função para verificar se uma URL é um vídeo suportado
export const isSupportedVideoUrl = (url: string): boolean => {
  return !!(
    url.match(/screenpal\.com\/watch\//) ||
    url.match(/youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\//) ||
    url.match(/vimeo\.com\/\d+/)
  );
};

// Função para obter o provedor do vídeo
export const getVideoProvider = (url: string): string => {
  if (url.match(/screenpal\.com/)) return 'ScreenPal';
  if (url.match(/youtube\.com|youtu\.be/)) return 'YouTube';
  if (url.match(/vimeo\.com/)) return 'Vimeo';
  return 'Desconhecido';
};
