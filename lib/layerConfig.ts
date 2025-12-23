import type { GeoJSONLayerConfig, WMSLayerConfig, LayerConfig } from "@/types/map";

export const PREDEFINED_LAYERS: LayerConfig[] = [
  {
    id: "sf-parks",
    name: "Map Edge",
    description: "Public parks and recreation areas",
    sourceUrl: "/api/geojson/sf-parks",
    geometryType: "polygon",
    visible: true,
    style: {
      color: "#10b981",
      opacity: 0.6,
      strokeColor: "#047857",
      strokeWidth: 2,
      fillOpacity: 0.4,
    },
  },
  {
    id: "jabar-cat-kepmen-ar",
    name: "CAT Jabar Kepmen AR",
    description: "Peta CAT Jawa Barat (Kepmen AR)",
    baseUrl: "https://geoserver.jabarprov.go.id/geoserver/desdm/wms",
    layers: "desdm:cat_jabar_kepmen_ar",
    version: "1.1.0",
    format: "image/png",
    transparent: true,
    visible: false,
    opacity: 0.8,
    srs: "EPSG:32748",
  } as WMSLayerConfig,
];

// For backward compatibility
export const GEOJSON_LAYERS = PREDEFINED_LAYERS.filter(
  (layer): layer is GeoJSONLayerConfig => 'sourceUrl' in layer
);
