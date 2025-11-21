
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
  'Serviços',
  'Estoques',
  'Contatos',
  'Logística',
  'Frente de caixa'
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
    logo: 'https://play-lh.googleusercontent.com/-oNcXnQ_0Kk4MyL4WWR56Se7fIPhPv65YWNwpF9PuyzRgmlezG0MiS6KYujQXka3yA=w240-h480-rw'
  },
  {
    id: 'bagy',
    name: 'Bagy',
    logo: 'https://bagy.com.br/blog/wp-content/uploads/2023/05/logo_3.png'
  },
  {
    id: 'woocommerce',
    name: 'Woocommerce',
    logo: 'https://s.w.org/style/images/about/WordPress-logotype-wmark.png'
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
    logo: ''
  }
];
