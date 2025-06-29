
// Mapeamento das plataformas com logos/favicons reais
export const platformConfigs = {
  nuvemshop: {
    color: '#00D4FF',
    name: 'Nuvemshop',
    logo: 'https://www.nuvemshop.com.br/favicon.ico'
  },
  bling: {
    color: '#7ED321',
    name: 'Bling',
    logo: 'https://www.bling.com.br/wp-content/themes/bling_br/images/bling.svg'
  },
  yampi: {
    color: '#9013FE',
    name: 'Yampi',
    logo: 'https://play-lh.googleusercontent.com/-oNcXnQ_0Kk4MyL4WWR56Se7fIPhPv65YWNwpF9PuyzRgmlezG0MiS6KYujQXka3yA=w240-h480-rw'
  },
  bagy: {
    color: '#FF6B6B',
    name: 'Bagy',
    logo: 'https://bagy.com.br/blog/wp-content/uploads/2023/05/logo_3.png'
  },
  woocommerce: {
    color: '#96588A',
    name: 'Woocommerce',
    logo: 'https://s.w.org/style/images/about/WordPress-logotype-wmark.png'
  },
  'olist-tiny': {
    color: '#4285F4',
    name: 'Olist/Tiny',
    logo: 'https://olist.com/favicon.ico'
  },
  wordpress: {
    color: '#21759B',
    name: 'Wordpress',
    logo: 'https://wordpress.com/favicon.ico'
  },
  outros: {
    color: '#6B7280',
    name: 'Outros',
    logo: null
  }
};

// Função para obter a cor da plataforma
export const getPlatformColor = (platform: string): string => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return config.color;
};

// Função para obter o logo da plataforma
export const getPlatformLogo = (platform: string): string | null => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return config.logo;
};

// Função para obter o nome da plataforma
export const getPlatformName = (platform: string): string => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return config.name;
};
