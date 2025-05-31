
export interface EditVideoFormData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  selectedCategories: string[];
  selectedClients: string[];
  publishDateTime: Date;
}

export interface EditVideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  initialData?: {
    title: string;
    description: string | null;
    video_url: string;
    thumbnail_url: string | null;
    category: string | null;
  };
}
