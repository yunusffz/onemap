import type { GeoJSONLayerConfig } from "@/types/map";

export const GEOJSON_LAYERS: GeoJSONLayerConfig[] = [
  {
    id: "sf-parks",
    name: "San Francisco Parks",
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
    id: "sf-bike-lanes",
    name: "SF Bike Lanes",
    description: "Bicycle routes and lanes",
    sourceUrl: "/api/geojson/sf-bike-lanes",
    geometryType: "line",
    visible: false,
    style: {
      color: "#3b82f6",
      opacity: 0.8,
      strokeWidth: 3,
    },
  },
  {
    id: "sf-transit",
    name: "Transit Stops",
    description: "Public transit stations",
    sourceUrl: "/api/geojson/sf-transit",
    geometryType: "point",
    visible: false,
    style: {
      color: "#ef4444",
      opacity: 0.8,
    },
    clustering: {
      enabled: true,
      radius: 50,
      maxZoom: 14,
    },
  },
];
