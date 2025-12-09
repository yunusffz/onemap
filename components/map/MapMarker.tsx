"use client";

import { Marker } from "react-map-gl/maplibre";

interface MapMarkerProps {
  longitude: number;
  latitude: number;
  onClick?: () => void;
  children?: React.ReactNode;
  color?: string;
}

export function MapMarker({
  longitude,
  latitude,
  onClick,
  children,
  color = "#3b82f6",
}: MapMarkerProps) {
  return (
    <Marker longitude={longitude} latitude={latitude} onClick={onClick}>
      {children || (
        <div
          className="w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        />
      )}
    </Marker>
  );
}
