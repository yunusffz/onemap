"use client";

import { useState, useCallback } from "react";

export type DrawMode = "pin" | "ruler" | "polygon" | null;

export interface DrawingState {
  mode: DrawMode;
  measurements: Map<string, { value: number; unit: string; coordinates?: [number, number] }>;
}

export function useDrawing() {
  const [mode, setMode] = useState<DrawMode>(null);
  const [measurements, setMeasurements] = useState<Map<string, { value: number; unit: string; coordinates?: [number, number] }>>(
    new Map()
  );

  const setDrawMode = useCallback((newMode: DrawMode) => {
    setMode((currentMode) => (currentMode === newMode ? null : newMode));
  }, []);

  const addMeasurement = useCallback((
    id: string,
    value: number,
    unit: string,
    coordinates?: [number, number]
  ) => {
    setMeasurements((prev) => {
      const newMap = new Map(prev);
      newMap.set(id, { value, unit, coordinates });
      return newMap;
    });
  }, []);

  const removeMeasurement = useCallback((id: string) => {
    setMeasurements((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  const clearMeasurements = useCallback(() => {
    setMeasurements(new Map());
  }, []);

  const clearAll = useCallback(() => {
    setMode(null);
    setMeasurements(new Map());
  }, []);

  return {
    mode,
    measurements,
    setDrawMode,
    addMeasurement,
    removeMeasurement,
    clearMeasurements,
    clearAll,
  };
}
