/**
 * Força uma URL para usar HTTPS
 * @param url URL para converter
 * @returns URL com HTTPS forçado
 */
export const forceHttps = (url: string): string => {
  if (!url) return url;
  
  // Se já é HTTPS, retorna como está
  if (url.startsWith('https://')) {
    return url;
  }
  
  // Se é HTTP, converte para HTTPS
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  
  // Se não tem protocolo, adiciona HTTPS
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Se é uma URL relativa ou sem protocolo, adiciona HTTPS
  if (!url.includes('://')) {
    return `https://${url}`;
  }
  
  return url;
};

/**
 * Garante que a aplicação use apenas HTTPS
 * Redireciona para HTTPS se necessário
 */
export const enforceHttps = (): void => {
  if (typeof window !== 'undefined' && 
      window.location.protocol === 'http:' && 
      window.location.hostname !== 'localhost' &&
      !window.location.hostname.includes('127.0.0.1')) {
    window.location.replace(window.location.href.replace('http:', 'https:'));
  }
};

/**
 * Gera URLs compartilháveis sempre com HTTPS
 * @param path Caminho relativo
 * @returns URL completa com HTTPS
 */
export const generateShareUrl = (path: string = ''): string => {
  if (typeof window === 'undefined') return '';
  
  const protocol = 'https:';
  const host = window.location.host;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${protocol}//${host}${cleanPath}`;
};

/**
 * Força HTTPS em todos os links de uma página
 * Processa links <a> para garantir que usem HTTPS
 */
export const forceHttpsOnAllLinks = (): void => {
  if (typeof window === 'undefined') return;
  
  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (href.startsWith('http://') || href.startsWith('//'))) {
      link.setAttribute('href', forceHttps(href));
    }
  });
};

/**
 * Redirecionamento seguro sempre com HTTPS
 * @param path Caminho para redirecionar
 */
export const safeRedirect = (path: string): void => {
  if (typeof window === 'undefined') return;
  
  const url = path.startsWith('/') ? generateShareUrl(path) : forceHttps(path);
  window.location.href = url;
};