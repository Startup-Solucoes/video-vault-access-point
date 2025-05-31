
export interface VideoFormData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  selectedCategories: string[];
  selectedClients: string[];
  publishDateTime: Date;
  platform: string;
}

export interface VideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoCreated?: () => void;
}

export const categories = [
  'Gerais',
  'Produto', 
  'Financeiro',
  'Relatórios',
  'Pedidos de venda',
  'Fiscal',
  'Integrações',
  'Serviços'
];

export const platforms = [
  {
    id: 'nuvemshop',
    name: 'Nuvemshop',
    logo: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=40&h=40&fit=crop'
  },
  {
    id: 'bling',
    name: 'Bling',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=40&h=40&fit=crop'
  },
  {
    id: 'yampi',
    name: 'Yampi',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=40&h=40&fit=crop'
  },
  {
    id: 'bagy',
    name: 'Bagy',
    logo: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=40&h=40&fit=crop'
  },
  {
    id: 'woocommerce',
    name: 'Woocommerce',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=40&h=40&fit=crop'
  },
  {
    id: 'olist-tiny',
    name: 'Olist/Tiny',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=40&h=40&fit=crop'
  },
  {
    id: 'wordpress',
    name: 'Wordpress',
    logo: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=40&h=40&fit=crop'
  },
  {
    id: 'outros',
    name: 'Outros',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=40&h=40&fit=crop'
  }
];
