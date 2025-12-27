import type { MapRef, ViewState } from "react-map-gl/maplibre";

export interface MapConfig {
  initialViewState: ViewState;
  mapStyle: string;
  minZoom?: number;
  maxZoom?: number;
}

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  label?: string;
}

export interface GeoJSONLayerConfig {
  id: string;
  name: string;
  description?: string;
  sourceUrl: string;
  geometryType: "polygon" | "line" | "point" | "mixed";
  visible: boolean;
  style: LayerStyle;
  clustering?: ClusterConfig;
}

export interface WMSLayerConfig {
  id: string;
  name: string;
  description?: string;
  baseUrl: string;
  layers: string;
  version?: string;
  format?: string;
  transparent?: boolean;
  visible: boolean;
  opacity?: number;
  attribution?: string;
  srs?: string; // Coordinate reference system (e.g., EPSG:3857, EPSG:4326)
}

export type LayerConfig = GeoJSONLayerConfig | WMSLayerConfig;

export function isWMSLayer(layer: LayerConfig): layer is WMSLayerConfig {
  return 'baseUrl' in layer && 'layers' in layer;
}

export function isGeoJSONLayer(layer: LayerConfig): layer is GeoJSONLayerConfig {
  return 'sourceUrl' in layer && 'geometryType' in layer;
}

export interface LayerStyle {
  color: string;
  opacity: number;
  strokeColor?: string;
  strokeWidth?: number;
  fillOpacity?: number;
}

export interface ClusterConfig {
  enabled: boolean;
  radius: number;
  maxZoom: number;
}

export interface CustomLayerMetadata extends GeoJSONLayerConfig {
  isCustom: true;
  createdAt: number;
  filename?: string;
  format?: string;
  featureCount?: number;
}

// Layer Search Types
export interface LayerSearchResult {
  id: string;
  name: string;
  description?: string;
  type: "geojson" | "wms";
  category?: string;
  organization?: string;
  thumbnailUrl?: string;
  config: GeoJSONLayerConfig | WMSLayerConfig;
}

export interface LayerDetail extends LayerSearchResult {
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    source?: string;
    license?: string;
    tags?: string[];
    featureCount?: number;
    bbox?: [number, number, number, number]; // [west, south, east, north]
  };
  producer?: {
    name: string;
    description?: string;
    thumbnail?: string;
    address?: string;
    phone_number?: string;
    email?: string;
    website?: string;
  };
}

export type { MapRef, ViewState };
