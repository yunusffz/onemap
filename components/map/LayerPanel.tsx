"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Layers, Loader2, AlertCircle, Plus, Trash2, Globe } from "lucide-react";
import type { GeoJSONLayerConfig, CustomLayerMetadata, WMSLayerConfig } from "@/types/map";

interface LayerPanelProps {
  predefinedLayers: GeoJSONLayerConfig[];
  customLayers: CustomLayerMetadata[];
  wmsLayers?: WMSLayerConfig[];
  queries: Array<{ isLoading: boolean; isError: boolean }>;
  onLayerToggle: (layerId: string) => void;
  onCustomLayerRemove: (layerId: string) => void;
  onWMSLayerToggle?: (layerId: string) => void;
  onWMSLayerRemove?: (layerId: string) => void;
  onAddLayerClick: () => void;
}

export function LayerPanel({
  predefinedLayers,
  customLayers,
  wmsLayers = [],
  queries,
  onLayerToggle,
  onCustomLayerRemove,
  onWMSLayerToggle,
  onWMSLayerRemove,
  onAddLayerClick,
}: LayerPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const allLayers = [...predefinedLayers, ...customLayers];
  const predefinedWMS = wmsLayers.filter((l) => !l.id.startsWith('wms-'));
  const customWMS = wmsLayers.filter((l) => l.id.startsWith('wms-'));

  // Filter layers based on search query
  const filterLayers = <T extends { name: string }>(layers: T[]) => {
    if (!searchQuery.trim()) return layers;
    return layers.filter((layer) =>
      layer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPredefinedLayers = filterLayers(predefinedLayers);
  const filteredCustomLayers = filterLayers(customLayers);
  const filteredPredefinedWMS = filterLayers(predefinedWMS);
  const filteredCustomWMS = filterLayers(customWMS);

  return (
    <Card className="shadow-md p-3 max-w-xs bg-card">
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <h3 className="font-semibold text-sm text-foreground">Map Layers</h3>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onAddLayerClick}
          className="h-7 w-7 p-0"
          title="Add Custom Layer"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <SearchInput
          placeholder="Search layers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Predefined Layers */}
      {filteredPredefinedLayers.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Base Layers
          </h4>
          {filteredPredefinedLayers.map((layer, index) => {
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
                    <span className="text-sm font-medium text-foreground">{layer.name}</span>
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
      )}

      {/* WMS Layers */}
      {filteredPredefinedWMS.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
            <Globe className="h-3 w-3" />
            WMS Layers
          </h4>
          {filteredPredefinedWMS.map((layer) => (
            <div
              key={layer.id}
              className="flex items-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                id={layer.id}
                checked={layer.visible}
                onChange={() => onWMSLayerToggle?.(layer.id)}
                className="mt-1 cursor-pointer"
              />
              <label htmlFor={layer.id} className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{layer.name}</span>
                  {layer.visible && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    WMS
                  </Badge>
                </div>
                {layer.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {layer.description}
                  </p>
                )}
              </label>
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-300 flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>
      )}

      {/* Custom WMS Layers */}
      {filteredCustomWMS.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Custom WMS
          </h4>
          {filteredCustomWMS.map((layer) => (
            <div
              key={layer.id}
              className="flex items-start gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                id={layer.id}
                checked={layer.visible}
                onChange={() => onWMSLayerToggle?.(layer.id)}
                className="mt-1 cursor-pointer"
              />
              <label htmlFor={layer.id} className="flex-1 cursor-pointer min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground truncate">
                    {layer.name}
                  </span>
                  {layer.visible && (
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    WMS
                  </Badge>
                </div>
                {layer.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {layer.description}
                  </p>
                )}
              </label>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-300 flex-shrink-0" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onWMSLayerRemove?.(layer.id)}
                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                  title="Remove Layer"
                >
                  <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Layers */}
      {filteredCustomLayers.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Custom Layers
          </h4>
          {filteredCustomLayers.map((layer, index) => {
            const queryIndex = predefinedLayers.length + index;
            const query = queries[queryIndex];
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
                <label htmlFor={layer.id} className="flex-1 cursor-pointer min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground truncate">
                      {layer.name}
                    </span>
                    {layer.format && (
                      <Badge variant="outline" className="text-xs">
                        {layer.format.toUpperCase()}
                      </Badge>
                    )}
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
                <div className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"
                    style={{
                      backgroundColor: layer.visible
                        ? layer.style.color
                        : "transparent",
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCustomLayerRemove(layer.id)}
                    className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    title="Remove Layer"
                  >
                    <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {filteredCustomLayers.length === 0 &&
       filteredPredefinedLayers.length === 0 &&
       filteredPredefinedWMS.length === 0 &&
       filteredCustomWMS.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          {searchQuery.trim() ? 'No layers match your search.' : 'No layers available. Click + to add a custom layer.'}
        </p>
      )}
    </Card>
  );
}
