
export interface Advertisement {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AdvertisementPermission {
  id: string;
  advertisement_id: string;
  client_id: string | null;
  created_at: string;
}

export interface AdvertisementWithPermissions extends Advertisement {
  permissions?: AdvertisementPermission[];
  client_count?: number;
}
