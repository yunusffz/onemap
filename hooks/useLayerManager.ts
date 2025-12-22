import { useState, useCallback } from "react";
import type { GeoJSONLayerConfig, CustomLayerMetadata } from "@/types/map";

export function useLayerManager(predefinedLayers: GeoJSONLayerConfig[]) {
  const [predefinedLayersState, setPredefinedLayersState] = useState(predefinedLayers);
  const [customLayers, setCustomLayers] = useState<CustomLayerMetadata[]>([]);

  const addCustomLayer = useCallback(
    (config: Omit<CustomLayerMetadata, "isCustom" | "createdAt">) => {
      const newLayer: CustomLayerMetadata = {
        ...config,
        isCustom: true,
        createdAt: Date.now(),
      };

      setCustomLayers((prev) => [...prev, newLayer]);
      return newLayer.id;
    },
    []
  );

  const removeCustomLayer = useCallback((id: string) => {
    setCustomLayers((prev) => prev.filter((layer) => layer.id !== id));
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    // Try custom layers first
    const isCustom = customLayers.some((layer) => layer.id === id);

    if (isCustom) {
      setCustomLayers((prev) =>
        prev.map((layer) =>
          layer.id === id ? { ...layer, visible: !layer.visible } : layer
        )
      );
    } else {
      // Toggle predefined layer
      setPredefinedLayersState((prev) =>
        prev.map((layer) =>
          layer.id === id ? { ...layer, visible: !layer.visible } : layer
        )
      );
    }
  }, [customLayers]);

  const updateLayerStyle = useCallback(
    (id: string, style: Partial<GeoJSONLayerConfig["style"]>) => {
      setCustomLayers((prev) =>
        prev.map((layer) =>
          layer.id === id
            ? { ...layer, style: { ...layer.style, ...style } }
            : layer
        )
      );
    },
    []
  );

  // Combine predefined and custom layers
  const allLayers = [...predefinedLayersState, ...customLayers];

  return {
    predefinedLayers: predefinedLayersState,
    customLayers,
    allLayers,
    addCustomLayer,
    removeCustomLayer,
    toggleLayerVisibility,
    updateLayerStyle,
  };
}
