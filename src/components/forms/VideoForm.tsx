import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ClientSelector, ClientSelectorRef } from './ClientSelector';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface VideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  'Gerais',
  'Produto', 
  'Financeiro',
  'Relatórios',
  'Pedidos de venda',
  'Fiscal',
  'Integrações',
  'Serviços'
];

export const VideoForm = ({ open, onOpenChange }: VideoFormProps) => {
  const { user } = useAuth();
  const clientSelectorRef = useRef<ClientSelectorRef>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    selectedCategories: [] as string[],
    selectedClients: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  const currentDateTime = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: checked
        ? [...prev.selectedCategories, category]
        : prev.selectedCategories.filter(c => c !== category)
    }));
  };

  const handleClientChange = (clientIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      selectedClients: clientIds
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      // Primeiro, cadastrar o vídeo
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert({
          title: formData.title,
          description: formData.description,
          video_url: formData.video_url,
          thumbnail_url: formData.thumbnail_url,
          category: formData.selectedCategories.join(', '),
          tags: formData.selectedCategories,
          created_by: user.id
        })
        .select()
        .single();

      if (videoError) throw videoError;

      // Em seguida, criar as permissões para os clientes selecionados
      if (formData.selectedClients.length > 0 && videoData) {
        const permissions = formData.selectedClients.map(clientId => ({
          video_id: videoData.id,
          client_id: clientId,
          granted_by: user.id
        }));

        const { error: permissionError } = await supabase
          .from('video_permissions')
          .insert(permissions);

        if (permissionError) throw permissionError;
      }

      console.log('Vídeo cadastrado com sucesso:', videoData);
      
      // Mostrar mensagem de sucesso
      toast({
        title: "Sucesso!",
        description: "Vídeo cadastrado com sucesso",
      });
      
      setFormData({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        selectedCategories: [],
        selectedClients: []
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao cadastrar vídeo:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar vídeo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Vídeo Aula</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Vídeo Aula</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título da vídeo aula"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da vídeo aula"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video_url">URL do Vídeo</Label>
            <Input
              id="video_url"
              value={formData.video_url}
              onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
              placeholder="https://..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">URL da Thumbnail (opcional)</Label>
            <Input
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>Categorias da Vídeo Aula</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={formData.selectedCategories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label htmlFor={category} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Clientes com Acesso</Label>
            <ClientSelector
              ref={clientSelectorRef}
              selectedClients={formData.selectedClients}
              onClientChange={handleClientChange}
            />
            <p className="text-xs text-gray-500">
              Selecione quais clientes terão acesso a este vídeo
            </p>
          </div>

          <div className="space-y-2">
            <Label>Data e Horário de Publicação</Label>
            <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-700">
              {currentDateTime}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Vídeo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
