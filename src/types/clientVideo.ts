
// Interface unificada para vídeos do cliente
export interface ClientVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  platform?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  created_by: string;
  permission_created_at: string;
}
