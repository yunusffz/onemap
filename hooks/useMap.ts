import { useRef, useCallback } from "react";
import type { MapRef } from "@/types/map";

export function useMap() {
  const mapRef = useRef<MapRef>(null);

  const getMap = useCallback(() => {
    return mapRef.current?.getMap();
  }, []);

  const flyTo = useCallback(
    (options: { longitude: number; latitude: number; zoom?: number }) => {
      mapRef.current?.flyTo({
        center: [options.longitude, options.latitude],
        zoom: options.zoom,
        duration: 1500,
      });
    },
    []
  );

  const fitBounds = useCallback(
    (bounds: [[number, number], [number, number]], padding = 50) => {
      mapRef.current?.fitBounds(bounds, {
        padding,
        duration: 1000,
      });
    },
    []
  );

  return {
    mapRef,
    getMap,
    flyTo,
    fitBounds,
  };
}
