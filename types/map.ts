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
  geometryType: "polygon" | "line" | "point";
  visible: boolean;
  style: LayerStyle;
  clustering?: ClusterConfig;
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

export type { MapRef, ViewState };
