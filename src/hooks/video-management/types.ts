
export interface VideoData {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  platform?: string;
  category?: string;
  tags?: string[];
  created_at: string;
  created_by: string;
}
