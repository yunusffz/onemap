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

// Map style options for dropdown
export const MAP_STYLE_OPTIONS = [
  { id: "positron", name: "Positron (Light)", url: MAP_STYLES.POSITRON },
  { id: "dark", name: "Dark Matter", url: MAP_STYLES.DARK_MATTER },
  { id: "voyager", name: "Voyager", url: MAP_STYLES.VOYAGER },
  { id: "bright", name: "OSM Bright", url: MAP_STYLES.OSM_BRIGHT },
  { id: "liberty", name: "OSM Liberty", url: MAP_STYLES.OSM_LIBERTY },
];

// Terrain DEM source for 3D terrain
export const TERRAIN_SOURCE = {
  type: "raster-dem" as const,
  url: "https://demotiles.maplibre.org/terrain-tiles/tiles.json",
  tileSize: 256,
};

export const TERRAIN_EXAGGERATION = 1.5;
