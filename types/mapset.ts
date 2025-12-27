export interface ListMapset {
  items: Mapset[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface Mapset {
  id: string;
  name: string;
  description: string;
  scale: string;
  layer_url: string;
  metadata_url: string;
  status_validation: string;
  classification: Classification;
  data_status: string;
  data_update_period: string;
  data_version: string;
  coverage_level: string;
  coverage_area: string;
  layer_type: string;
  category: Category;
  projection_system: ProjectionSystem;
  producer: Producer;
  regional: Regional;
  sources: Source[];
  view_count: number;
  download_count: number;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Classification {
  id: string;
  name: string;
  is_open: boolean;
  is_limited: boolean;
  is_secret: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  count_mapset: number;
  is_active: boolean;
}

export interface ProjectionSystem {
  id: string;
  name: string;
}

export interface Producer {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  address: string;
  phone_number: string;
  email: string;
  website: string;
}

export interface Regional {
  id: string;
  code: string;
  name: string;
  description: string;
  thumbnail: any;
  is_active: boolean;
}

export interface Source {
  id: string;
  name: string;
  description: string;
  credential: Credential;
  url: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Credential {
  id: string;
  name: string;
  description: string;
  credential_type: string;
  credential_metadata: CredentialMetadata;
  is_default: boolean;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  last_used_at: any;
  last_used_by: any;
}

export interface CredentialMetadata {
  environment: string;
  version: string;
}
