"use client";

import { useState, useCallback } from "react";
import ReactMapGL, { NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import type { MapRef, ViewState } from "@/types/map";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";
import "maplibre-gl/dist/maplibre-gl.css";

interface MapProps {
  mapRef?: React.RefObject<MapRef | null>;
  initialViewState?: Partial<ViewState>;
  mapStyle?: string;
  minZoom?: number;
  maxZoom?: number;
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

  return (
    <div className={className}>
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
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-left" />
        {children}
      </ReactMapGL>
    </div>
  );
}
