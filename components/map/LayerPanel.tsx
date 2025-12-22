"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Loader2, AlertCircle } from "lucide-react";
import type { GeoJSONLayerConfig } from "@/types/map";

interface LayerPanelProps {
  layers: GeoJSONLayerConfig[];
  queries: Array<{ isLoading: boolean; isError: boolean }>;
  onLayerToggle: (layerId: string) => void;
}

export function LayerPanel({
  layers,
  queries,
  onLayerToggle,
}: LayerPanelProps) {
  return (
    <Card className="!bg-white dark:!bg-gray-800 shadow-md p-3 max-w-xs">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b">
        <Layers className="h-4 w-4" />
        <h3 className="font-semibold text-sm">Map Layers</h3>
      </div>

      <div className="space-y-2">
        {layers.map((layer, index) => {
          const query = queries[index];
          const isLoading = query?.isLoading;
          const hasError = query?.isError;

          return (
            <div
              key={layer.id}
              className="flex items-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                id={layer.id}
                checked={layer.visible}
                onChange={() => onLayerToggle(layer.id)}
                disabled={isLoading || hasError}
                className="mt-1 cursor-pointer"
              />
              <label htmlFor={layer.id} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{layer.name}</span>
                  {layer.visible && !isLoading && !hasError && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                  {isLoading && (
                    <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                  )}
                  {hasError && (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                </div>
                {layer.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {layer.description}
                  </p>
                )}
              </label>
              <div
                className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0 mt-1"
                style={{
                  backgroundColor: layer.visible
                    ? layer.style.color
                    : "transparent",
                }}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
