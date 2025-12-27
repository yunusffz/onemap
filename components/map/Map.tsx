"use client";

import { useState, useCallback, useEffect } from "react";
import ReactMapGL, {
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";
import type { MapRef, ViewState } from "@/types/map";
import {
  DEFAULT_MAP_CONFIG,
  TERRAIN_SOURCE,
  TERRAIN_EXAGGERATION,
} from "@/lib/mapConfig";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  mapRef?: React.RefObject<MapRef | null>;
  initialViewState?: Partial<ViewState>;
  mapStyle?: string;
  minZoom?: number;
  maxZoom?: number;
  terrain?: boolean;
  onLoad?: () => void;
  onMoveEnd?: (viewState: ViewState) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Map({
  mapRef,
  initialViewState,
  mapStyle = DEFAULT_MAP_CONFIG.mapStyle,
  minZoom = DEFAULT_MAP_CONFIG.minZoom,
  maxZoom = DEFAULT_MAP_CONFIG.maxZoom,
  terrain = false,
  onLoad,
  onMoveEnd,
  children,
  className = "w-full h-full",
}: MapProps) {
  const [viewState, setViewState] = useState<Partial<ViewState>>({
    ...DEFAULT_MAP_CONFIG.initialViewState,
    ...initialViewState,
  });

  const handleMove = useCallback((evt: { viewState: ViewState }) => {
    setViewState(evt.viewState);
  }, []);

  const handleMoveEnd = useCallback(() => {
    if (onMoveEnd && viewState) {
      onMoveEnd(viewState as ViewState);
    }
  }, [onMoveEnd, viewState]);

  // Handle terrain enable/disable
  useEffect(() => {
    if (!mapRef?.current) return;

    const map = mapRef.current.getMap();
    if (!map || !map.isStyleLoaded()) return;

    const sourceId = "terrain-source";

    if (terrain) {
      // Add terrain source if it doesn't exist
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, TERRAIN_SOURCE);
      }
      // Enable terrain
      map.setTerrain({
        source: sourceId,
        exaggeration: TERRAIN_EXAGGERATION,
      });
    } else {
      // Disable terrain
      if (map.getTerrain()) {
        map.setTerrain(null);
      }
    }
  }, [terrain, mapRef]);

  return (
    <div className={className}>
      <style dangerouslySetInnerHTML={{__html: `
        .maplibregl-ctrl-top-right {
          top: 50% !important;
          transform: translateY(-50%);
        }
      `}} />
      <ReactMapGL
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        onLoad={onLoad}
        mapStyle={mapStyle}
        minZoom={minZoom}
        maxZoom={maxZoom}
        attributionControl={false}
        reuseMaps
      >
        <NavigationControl position="top-right" showCompass visualizePitch />
        <ScaleControl position="bottom-left" />
        {children}
      </ReactMapGL>
    </div>
  );
}
