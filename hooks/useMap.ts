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

  const setPitch = useCallback((pitch: number) => {
    mapRef.current?.easeTo({
      pitch,
      duration: 1000,
    });
  }, []);

  const toggleView = useCallback((is3D: boolean) => {
    const pitch = is3D ? 60 : 0;
    setPitch(pitch);
  }, [setPitch]);

  return {
    mapRef,
    getMap,
    flyTo,
    fitBounds,
    setPitch,
    toggleView,
  };
}
