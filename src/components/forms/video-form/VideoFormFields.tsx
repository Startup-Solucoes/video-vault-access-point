
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { VideoFormData } from './VideoFormTypes';

interface VideoFormFieldsProps {
  formData: VideoFormData;
  onFieldChange: (field: keyof VideoFormData, value: string) => void;
}

export const VideoFormFields: React.FC<VideoFormFieldsProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título da Vídeo Aula</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => {
            console.log('Título alterado:', e.target.value);
            onFieldChange('title', e.target.value);
          }}
          placeholder="Digite o título da vídeo aula"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => {
            console.log('Descrição alterada:', e.target.value);
            onFieldChange('description', e.target.value);
          }}
          placeholder="Descrição da vídeo aula"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video_url">URL do Vídeo</Label>
        <Input
          id="video_url"
          value={formData.video_url}
          onChange={(e) => {
            console.log('URL do vídeo alterada:', e.target.value);
            onFieldChange('video_url', e.target.value);
          }}
          placeholder="https://..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail_url">URL da Thumbnail (Opcional)</Label>
        <Input
          id="thumbnail_url"
          value={formData.thumbnail_url}
          onChange={(e) => {
            console.log('Thumbnail alterada:', e.target.value);
            onFieldChange('thumbnail_url', e.target.value);
          }}
          placeholder="https://exemplo.com/imagem.jpg"
        />
        <p className="text-sm text-gray-600">
          Cole aqui a URL de uma imagem para usar como thumbnail do vídeo
        </p>
      </div>
    </>
  );
};
