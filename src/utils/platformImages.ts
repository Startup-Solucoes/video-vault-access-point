
// Mapeamento das plataformas com logos/imagens locais
export const platformConfigs = {
  nuvemshop: {
    color: '#00D4FF',
    name: 'Nuvemshop',
    logo: '/lovable-uploads/79f5953e-cebc-4bf8-b0bf-7873084aa496.png'
  },
  bling: {
    color: '#7ED321',
    name: 'Bling',
    logo: '/lovable-uploads/506360a2-2e3c-4e2d-965c-0017c59d36af.png'
  },
  yampi: {
    color: '#9013FE',
    name: 'Yampi',
    logo: '/lovable-uploads/b48eb6a8-72e0-45e9-9d0f-ed7f4e389cd3.png'
  },
  bagy: {
    color: '#FF6B6B',
    name: 'Bagy',
    logo: '/lovable-uploads/fe7a27bd-9667-4a19-ad9a-a632cd4792d4.png'
  },
  woocommerce: {
    color: '#96588A',
    name: 'Woocommerce',
    logo: '/lovable-uploads/5c7b73d0-315a-4b66-a49c-9a659ac42ba1.png'
  },
  'olist-tiny': {
    color: '#4285F4',
    name: 'Olist/Tiny',
    logo: '/lovable-uploads/dfd22cd4-d367-48df-a0f5-29c708b797ce.png'
  },
  wordpress: {
    color: '#21759B',
    name: 'Wordpress',
    logo: '/lovable-uploads/833ca344-7e30-4b0e-907a-01b500e56050.png'
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
