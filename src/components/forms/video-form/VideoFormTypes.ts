
export interface VideoFormData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  selectedCategories: string[];
  selectedClients: string[];
  publishDateTime: Date;
}

export interface VideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
