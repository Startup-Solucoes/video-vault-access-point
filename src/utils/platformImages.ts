
import { Youtube, Play, Video, Twitch, Facebook, Instagram, Globe, Monitor, Zap, ShoppingCart, Package, Briefcase, Wordpress } from 'lucide-react';

// Mapeamento correto das plataformas com os ícones do modal
export const platformConfigs = {
  nuvemshop: {
    color: '#00D4FF',
    name: 'Nuvemshop',
    icon: ShoppingCart
  },
  bling: {
    color: '#7ED321',
    name: 'Bling',
    icon: Zap
  },
  yampi: {
    color: '#9013FE',
    name: 'Yampi',
    icon: Package
  },
  bagy: {
    color: '#FF6B6B',
    name: 'Bagy',
    icon: ShoppingCart
  },
  woocommerce: {
    color: '#96588A',
    name: 'Woocommerce',
    icon: Wordpress
  },
  'olist-tiny': {
    color: '#4285F4',
    name: 'Olist/Tiny',
    icon: Briefcase
  },
  wordpress: {
    color: '#21759B',
    name: 'Wordpress',
    icon: Wordpress
  },
  outros: {
    color: '#6B7280',
    name: 'Outros',
    icon: Globe
  }
};

// Função para obter a cor da plataforma
export const getPlatformColor = (platform: string): string => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return config.color;
};

// Função para obter o ícone da plataforma
export const getPlatformIcon = (platform: string) => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return config.icon;
};

// Função para obter o nome da plataforma
export const getPlatformName = (platform: string): string => {
  const config = platformConfigs[platform as keyof typeof platformConfigs] || platformConfigs.outros;
  return config.name;
};
