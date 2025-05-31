
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
    logo: 'https://www.nuvemshop.com.br/favicon.ico'
  },
  {
    id: 'bling',
    name: 'Bling',
    logo: 'https://www.bling.com.br/favicon.ico'
  },
  {
    id: 'yampi',
    name: 'Yampi',
    logo: 'https://www.yampi.com.br/favicon.ico'
  },
  {
    id: 'bagy',
    name: 'Bagy',
    logo: 'https://www.bagy.com.br/favicon.ico'
  },
  {
    id: 'woocommerce',
    name: 'Woocommerce',
    logo: 'https://woocommerce.com/favicon.ico'
  },
  {
    id: 'olist-tiny',
    name: 'Olist/Tiny',
    logo: 'https://olist.com/favicon.ico'
  },
  {
    id: 'wordpress',
    name: 'Wordpress',
    logo: 'https://wordpress.com/favicon.ico'
  },
  {
    id: 'outros',
    name: 'Outros',
    logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=32&h=32&fit=crop'
  }
];
