"use client";

import { useEffect, useRef, useCallback } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Popup } from "maplibre-gl";
import type { MapRef } from "@/types/map";
import type { DrawMode } from "@/hooks/useDrawing";
import * as turf from "@turf/turf";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "maplibre-gl/dist/maplibre-gl.css";

interface DrawControlProps {
  mapRef: React.RefObject<MapRef | null>;
  mode: DrawMode;
  onMeasurement: (
    id: string,
    value: number,
    unit: string,
    coordinates?: [number, number]
  ) => void;
  onDelete: (id: string) => void;
}

export function DrawControl({
  mapRef,
  mode,
  onMeasurement,
  onDelete,
}: DrawControlProps) {
  const drawRef = useRef<MapboxDraw | null>(null);
  const popupsRef = useRef<Map<string, Popup>>(new Map());

  // Add popup function
  const addPopup = useCallback((featureId: string, coordinates: number[], text: string) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Remove existing popup for this feature if any
    const existingPopup = popupsRef.current.get(featureId);
    if (existingPopup) {
      existingPopup.remove();
    }

    // Create new popup
    const popup = new Popup({
      closeButton: true,
      closeOnClick: false,
      className: "measurement-popup",
      maxWidth: "300px",
    })
      .setLngLat(coordinates as [number, number])
      .setHTML(
        `<div style="
        background: white;
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: #1f2937;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        white-space: pre-line;
        line-height: 1.5;
      ">${text}</div>`
      )
      .addTo(map);

    // Store popup reference
    popupsRef.current.set(featureId, popup);

    // Remove from ref when popup is closed
    popup.on("close", () => {
      popupsRef.current.delete(featureId);
    });
  }, [mapRef]);

  // Calculate measurement
  const calculateMeasurement = useCallback((feature: any) => {
    const { id, geometry } = feature;

    if (geometry.type === "Point") {
      // For points, show coordinates
      const [lng, lat] = geometry.coordinates;
      onMeasurement(id, lat, "lat/lng", [lng, lat]);

      // Add popup to map
      addPopup(
        id,
        geometry.coordinates,
        `Lat: ${lat.toFixed(6)}\nLng: ${lng.toFixed(6)}`
      );
    } else if (geometry.type === "LineString") {
      // Calculate distance for lines
      const line = turf.lineString(geometry.coordinates);
      const lengthMeters = turf.length(line, { units: "meters" });

      let displayValue: number;
      let unit: string;

      if (lengthMeters >= 1000) {
        displayValue = lengthMeters / 1000;
        unit = "km";
      } else {
        displayValue = lengthMeters;
        unit = "m";
      }

      onMeasurement(id, displayValue, unit);

      // Add popup to map at the midpoint
      const midpoint = turf.along(line, turf.length(line) / 2);
      addPopup(
        id,
        midpoint.geometry.coordinates,
        `Distance: ${displayValue.toFixed(2)} ${unit}`
      );
    } else if (geometry.type === "Polygon") {
      // Calculate area for polygons
      const polygon = turf.polygon(geometry.coordinates);
      const areaSquareMeters = turf.area(polygon);

      let displayValue: number;
      let unit: string;

      if (areaSquareMeters >= 1000000) {
        // Convert to km² if >= 1,000,000 m²
        displayValue = areaSquareMeters / 1000000;
        unit = "km²";
      } else {
        displayValue = areaSquareMeters;
        unit = "m²";
      }

      onMeasurement(id, displayValue, unit);

      // Add popup to map at the centroid
      const centroid = turf.centroid(polygon);
      addPopup(
        id,
        centroid.geometry.coordinates,
        `Area: ${displayValue.toFixed(2)} ${unit}`
      );
    }
  }, [onMeasurement, addPopup]);

  // Event handlers
  const handleCreate = useCallback((e: any) => {
    const feature = e.features[0];
    if (!feature) return;

    calculateMeasurement(feature);
  }, [calculateMeasurement]);

  const handleUpdate = useCallback((e: any) => {
    const feature = e.features[0];
    if (!feature) return;

    calculateMeasurement(feature);
  }, [calculateMeasurement]);

  const handleDeleteFeature = useCallback((e: any) => {
    e.features.forEach((feature: any) => {
      onDelete(feature.id);
      // Remove associated popup
      const popup = popupsRef.current.get(feature.id);
      if (popup) {
        popup.remove();
        popupsRef.current.delete(feature.id);
      }
    });
  }, [onDelete]);

  // Clear all drawings when mode becomes null (Reset clicked)
  useEffect(() => {
    if (mode === null && drawRef.current) {
      const map = mapRef.current?.getMap();
      if (map) {
        // Delete all features
        drawRef.current.deleteAll();
        // Remove all popups
        popupsRef.current.forEach((popup) => popup.remove());
        popupsRef.current.clear();
      }
    }
  }, [mode, mapRef]);

  // Initialize MapboxDraw once
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || drawRef.current) return;

    drawRef.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      defaultMode: "simple_select",
      styles: [
        // Point styles
        {
          id: "gl-draw-point",
          type: "circle",
          filter: ["all", ["==", "$type", "Point"], ["!=", "mode", "static"]],
          paint: {
            "circle-radius": 8,
            "circle-color": "#3b82f6",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        },
        // Line styles
        {
          id: "gl-draw-line",
          type: "line",
          filter: [
            "all",
            ["==", "$type", "LineString"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "line-color": "#ef4444",
            "line-width": 3,
          },
        },
        // Line vertex points
        {
          id: "gl-draw-line-vertex",
          type: "circle",
          filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
          paint: {
            "circle-radius": 5,
            "circle-color": "#ef4444",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        },
        // Polygon fill
        {
          id: "gl-draw-polygon-fill",
          type: "fill",
          filter: [
            "all",
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "fill-color": "#10b981",
            "fill-opacity": 0.3,
          },
        },
        // Polygon outline
        {
          id: "gl-draw-polygon-stroke",
          type: "line",
          filter: [
            "all",
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "line-color": "#10b981",
            "line-width": 3,
          },
        },
        // Polygon vertex points
        {
          id: "gl-draw-polygon-vertex",
          type: "circle",
          filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"]],
          paint: {
            "circle-radius": 5,
            "circle-color": "#10b981",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
          },
        },
      ],
    });

    map.addControl(drawRef.current as any);
  }, [mapRef]);

  // Attach event listeners (separate from initialization)
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map || !drawRef.current) return;

    map.on("draw.create", handleCreate);
    map.on("draw.update", handleUpdate);
    map.on("draw.delete", handleDeleteFeature);

    return () => {
      map.off("draw.create", handleCreate);
      map.off("draw.update", handleUpdate);
      map.off("draw.delete", handleDeleteFeature);
    };
  }, [mapRef, handleCreate, handleUpdate, handleDeleteFeature]);

  // Handle mode changes
  useEffect(() => {
    if (!drawRef.current) return;

    switch (mode) {
      case "pin":
        drawRef.current.changeMode("draw_point");
        break;
      case "ruler":
        drawRef.current.changeMode("draw_line_string");
        break;
      case "polygon":
        drawRef.current.changeMode("draw_polygon");
        break;
      default:
        drawRef.current.changeMode("simple_select");
    }
  }, [mode]);

  return null;
}
