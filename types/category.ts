export interface ListCategory {
  items: Category[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  count_mapset: number;
  is_active: boolean;
}
