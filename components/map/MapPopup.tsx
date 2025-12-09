"use client";

import { Popup } from "react-map-gl/maplibre";

interface MapPopupProps {
  longitude: number;
  latitude: number;
  onClose: () => void;
  children: React.ReactNode;
  closeOnClick?: boolean;
  anchor?: "center" | "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
  closeOnClick = true,
  anchor = "bottom",
}: MapPopupProps) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      onClose={onClose}
      closeOnClick={closeOnClick}
      anchor={anchor}
      className="map-popup"
    >
      <div className="p-2">{children}</div>
    </Popup>
  );
}
