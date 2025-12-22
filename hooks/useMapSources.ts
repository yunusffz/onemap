import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import type { MapRef } from "@/types/map";
import type { GeoJSONLayerConfig } from "@/types/map";

export function useMapSources(
  mapRef: React.RefObject<MapRef | null>,
  layerConfigs: GeoJSONLayerConfig[]
) {
  // Fetch all GeoJSON sources in parallel
  const queries = useQueries({
    queries: layerConfigs.map((config) => ({
      queryKey: ["geojson", config.id],
      queryFn: async () => {
        const response = await fetch(config.sourceUrl);
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
      retry: 2,
    })),
  });

  // Add source and layers as data arrives
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !map.isStyleLoaded()) return;

    queries.forEach((query, index) => {
      const config = layerConfigs[index];
      const sourceId = `${config.id}-source`;
      const layerId = config.id;

      // Add source if data is loaded and source doesn't exist
      if (query.data && !map.getSource(sourceId)) {
        if (config.clustering?.enabled) {
          map.addSource(sourceId, {
            type: "geojson",
            data: query.data,
            cluster: true,
            clusterRadius: config.clustering.radius,
            clusterMaxZoom: config.clustering.maxZoom,
          });
        } else {
          map.addSource(sourceId, {
            type: "geojson",
            data: query.data,
          });
        }

        // Add layers based on geometry type
        addLayersForGeometry(map, config, sourceId, layerId);
      }

      // Update layer visibility
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(
          layerId,
          "visibility",
          config.visible ? "visible" : "none"
        );
      }

      // Update outline layer visibility for polygons
      if (config.geometryType === "polygon" && map.getLayer(`${layerId}-outline`)) {
        map.setLayoutProperty(
          `${layerId}-outline`,
          "visibility",
          config.visible ? "visible" : "none"
        );
      }

      // Update cluster layers visibility for points
      if (config.clustering?.enabled) {
        if (map.getLayer(`${layerId}-cluster-count`)) {
          map.setLayoutProperty(
            `${layerId}-cluster-count`,
            "visibility",
            config.visible ? "visible" : "none"
          );
        }
        if (map.getLayer(`${layerId}-unclustered`)) {
          map.setLayoutProperty(
            `${layerId}-unclustered`,
            "visibility",
            config.visible ? "visible" : "none"
          );
        }
      }
    });
  }, [queries, layerConfigs, mapRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      layerConfigs.forEach((config) => {
        const sourceId = `${config.id}-source`;
        const layerId = config.id;

        // Remove layers
        if (map.getLayer(`${layerId}-outline`)) {
          map.removeLayer(`${layerId}-outline`);
        }
        if (map.getLayer(`${layerId}-cluster-count`)) {
          map.removeLayer(`${layerId}-cluster-count`);
        }
        if (map.getLayer(`${layerId}-unclustered`)) {
          map.removeLayer(`${layerId}-unclustered`);
        }
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }

        // Remove source
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
    };
  }, [layerConfigs, mapRef]);

  return {
    queries,
    isLoading: queries.some((q) => q.isLoading),
    hasErrors: queries.some((q) => q.isError),
  };
}

function addLayersForGeometry(
  map: any,
  config: GeoJSONLayerConfig,
  sourceId: string,
  layerId: string
) {
  if (config.geometryType === "polygon") {
    // Fill layer
    map.addLayer({
      id: layerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": config.style.color,
        "fill-opacity": config.style.fillOpacity || 0.4,
      },
    });

    // Outline layer
    map.addLayer({
      id: `${layerId}-outline`,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": config.style.strokeColor || config.style.color,
        "line-width": config.style.strokeWidth || 2,
        "line-opacity": config.style.opacity,
      },
    });
  } else if (config.geometryType === "line") {
    map.addLayer({
      id: layerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": config.style.color,
        "line-width": config.style.strokeWidth || 2,
        "line-opacity": config.style.opacity,
      },
    });
  } else if (config.geometryType === "point") {
    if (config.clustering?.enabled) {
      // Cluster circles
      map.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": config.style.color,
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            10,
            30,
            50,
            40,
          ],
          "circle-opacity": config.style.opacity,
        },
      });

      // Cluster count labels
      map.addLayer({
        id: `${layerId}-cluster-count`,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // Unclustered points
      map.addLayer({
        id: `${layerId}-unclustered`,
        type: "circle",
        source: sourceId,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": config.style.color,
          "circle-radius": 6,
          "circle-opacity": config.style.opacity,
        },
      });
    } else {
      map.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        paint: {
          "circle-color": config.style.color,
          "circle-radius": 6,
          "circle-opacity": config.style.opacity,
        },
      });
    }
  }
}
