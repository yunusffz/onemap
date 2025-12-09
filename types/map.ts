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

export type { MapRef, ViewState };
