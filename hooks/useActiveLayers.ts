import { useState, useCallback, useMemo, useEffect } from "react";
import type { GeoJSONLayerConfig, WMSLayerConfig, CustomLayerMetadata } from "@/types/map";

interface UseActiveLayersProps {
  predefinedGeoJSONLayers: GeoJSONLayerConfig[];
  predefinedWMSLayers: WMSLayerConfig[];
  isMounted: boolean;
}

export function useActiveLayers({
  predefinedGeoJSONLayers,
  predefinedWMSLayers,
  isMounted,
}: UseActiveLayersProps) {
  const [predefinedGeoJSON, setPredefinedGeoJSON] = useState(predefinedGeoJSONLayers);
  const [customGeoJSON, setCustomGeoJSON] = useState<CustomLayerMetadata[]>([]);
  const [wmsLayers, setWmsLayers] = useState<WMSLayerConfig[]>(predefinedWMSLayers);

  // Clear all active layers when component unmounts
  useEffect(() => {
    if (!isMounted) {
      setPredefinedGeoJSON([]);
      setCustomGeoJSON([]);
      setWmsLayers([]);
    }
  }, [isMounted]);

  // GeoJSON Layer Management
  const addCustomLayer = useCallback(
    (config: Omit<CustomLayerMetadata, "isCustom" | "createdAt">) => {
      const newLayer: CustomLayerMetadata = {
        ...config,
        isCustom: true,
        createdAt: Date.now(),
      };

      setCustomGeoJSON((prev) => [...prev, newLayer]);
      return newLayer.id;
    },
    []
  );

  const removeCustomLayer = useCallback((id: string) => {
    setCustomGeoJSON((prev) => prev.filter((layer) => layer.id !== id));
  }, []);

  const toggleGeoJSONLayerVisibility = useCallback((id: string) => {
    // Try custom layers first
    setCustomGeoJSON((prev) => {
      const layer = prev.find((l) => l.id === id);
      if (layer) {
        return prev.map((l) =>
          l.id === id ? { ...l, visible: !l.visible } : l
        );
      }
      return prev;
    });

    // Try predefined layers
    setPredefinedGeoJSON((prev) => {
      const layer = prev.find((l) => l.id === id);
      if (layer) {
        return prev.map((l) =>
          l.id === id ? { ...l, visible: !l.visible } : l
        );
      }
      return prev;
    });
  }, []);

  const updateLayerStyle = useCallback(
    (id: string, style: Partial<GeoJSONLayerConfig["style"]>) => {
      setCustomGeoJSON((prev) =>
        prev.map((layer) =>
          layer.id === id
            ? { ...layer, style: { ...layer.style, ...style } }
            : layer
        )
      );
    },
    []
  );

  // WMS Layer Management
  const addWMSLayer = useCallback((wmsConfig: Omit<WMSLayerConfig, "id" | "visible">) => {
    const newLayer: WMSLayerConfig = {
      ...wmsConfig,
      id: `wms-${Date.now()}`,
      visible: true,
    };
    setWmsLayers((prev) => [...prev, newLayer]);
    return newLayer.id;
  }, []);

  const toggleWMSLayerVisibility = useCallback((id: string) => {
    setWmsLayers((prev) =>
      prev.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const removeWMSLayer = useCallback((id: string) => {
    setWmsLayers((prev) => prev.filter((layer) => layer.id !== id));
  }, []);

  // Combine all layers
  const allGeoJSONLayers = useMemo(
    () => [...predefinedGeoJSON, ...customGeoJSON],
    [predefinedGeoJSON, customGeoJSON]
  );

  // Active layers (only visible ones)
  const activeGeoJSONLayers = useMemo(
    () => allGeoJSONLayers.filter((layer) => layer.visible),
    [allGeoJSONLayers]
  );

  const activeWMSLayers = useMemo(
    () => wmsLayers.filter((layer) => layer.visible),
    [wmsLayers]
  );

  return {
    // GeoJSON Layers
    predefinedGeoJSON,
    customGeoJSON,
    allGeoJSONLayers,
    activeGeoJSONLayers,
    addCustomLayer,
    removeCustomLayer,
    toggleGeoJSONLayerVisibility,
    updateLayerStyle,

    // WMS Layers
    wmsLayers,
    activeWMSLayers,
    addWMSLayer,
    toggleWMSLayerVisibility,
    removeWMSLayer,
  };
}
