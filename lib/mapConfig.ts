import type { MapConfig } from "@/types/map";

export const DEFAULT_MAP_CONFIG: MapConfig = {
  initialViewState: {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
  mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  minZoom: 0,
  maxZoom: 22,
};

// Alternative map styles
export const MAP_STYLES = {
  POSITRON: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  DARK_MATTER: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  VOYAGER: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
  OSM_BRIGHT: "https://tiles.openfreemap.org/styles/bright",
  OSM_LIBERTY: "https://tiles.openfreemap.org/styles/liberty",
};
