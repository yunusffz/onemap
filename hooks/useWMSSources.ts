import { useEffect, useState } from "react";
import type { MapRef } from "@/types/map";
import type { WMSLayerConfig } from "@/types/map";

export function useWMSSources(
  mapRef: React.RefObject<MapRef | null>,
  wmsLayers: WMSLayerConfig[]
) {
  const [mapReady, setMapReady] = useState(false);

  // Check if map is ready
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const checkReady = () => {
      if (map.isStyleLoaded()) {
        setMapReady(true);
      }
    };

    checkReady();

    const onLoad = () => checkReady();
    const onStyleData = () => checkReady();
    const onIdle = () => checkReady();

    map.on('load', onLoad);
    map.on('styledata', onStyleData);
    map.on('idle', onIdle);

    // Fallback: check every second for up to 10 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      checkReady();
      if (attempts >= 10 || map.isStyleLoaded()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      map.off('load', onLoad);
      map.off('styledata', onStyleData);
      map.off('idle', onIdle);
      clearInterval(interval);
    };
  }, [mapRef]);

  // Add WMS sources and layers to the map
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    wmsLayers.forEach((config) => {
      const sourceId = `${config.id}-source`;
      const layerId = config.id;

      // Add WMS source if it doesn't exist
      if (!map?.getSource(sourceId)) {
        try {
          const version = config.version || '1.1.1';

          // MapLibre always uses EPSG:3857 (Web Mercator) for tiles
          // We request tiles in EPSG:3857, and the WMS server will reproject if needed
          const tileSrs = 'EPSG:3857';

          // Determine SRS parameter name based on WMS version
          // WMS 1.3.0+ uses CRS, earlier versions use SRS
          const srsParam = version.startsWith('1.3') ? 'CRS' : 'SRS';

          // Always use bbox-epsg-3857 for MapLibre's tile grid
          const bboxPlaceholder = '{bbox-epsg-3857}';

          const tileUrl = `${config.baseUrl}?SERVICE=WMS&VERSION=${version}&REQUEST=GetMap&LAYERS=${config.layers}&BBOX=${bboxPlaceholder}&WIDTH=256&HEIGHT=256&${srsParam}=${tileSrs}&FORMAT=${config.format || 'image/png'}&TRANSPARENT=${config.transparent ? 'TRUE' : 'FALSE'}`;

          // Build source config - only include attribution if defined
          const sourceConfig: any = {
            type: 'raster',
            tiles: [tileUrl],
            tileSize: 256,
          };

          if (config.attribution) {
            sourceConfig.attribution = config.attribution;
          }

          map?.addSource(sourceId, sourceConfig);

          // Add raster layer
          map?.addLayer({
            id: layerId,
            type: 'raster',
            source: sourceId,
            paint: {
              'raster-opacity': config.opacity || 1.0,
            },
          });
        } catch (error) {
          console.error('Error adding WMS layer:', error);
        }
      }

      // Update layer visibility
      if (map?.getLayer(layerId)) {
        map?.setLayoutProperty(
          layerId,
          'visibility',
          config.visible ? 'visible' : 'none'
        );
      }

      // Update layer opacity
      if (map?.getLayer(layerId)) {
        map?.setPaintProperty(
          layerId,
          'raster-opacity',
          config.opacity || 1.0
        );
      }
    });
  }, [wmsLayers, mapRef, mapReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const map = mapRef.current?.getMap();
      if (!map) return;

      wmsLayers.forEach((config) => {
        const sourceId = `${config.id}-source`;
        const layerId = config.id;

        // Remove layer
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }

        // Remove source
        if (map.getSource(sourceId)) {
          map.removeSource(sourceId);
        }
      });
    };
  }, [wmsLayers, mapRef]);

  return {
    isLoading: false,
    hasErrors: false,
  };
}
