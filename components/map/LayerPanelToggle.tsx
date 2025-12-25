"use client";

import { LayerPanel } from "@/components/map/LayerPanel";
import type { GeoJSONLayerConfig, WMSLayerConfig, CustomLayerMetadata } from "@/types/map";

interface LayerPanelToggleProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  predefinedLayers: GeoJSONLayerConfig[];
  customLayers: CustomLayerMetadata[];
  wmsLayers: WMSLayerConfig[];
  queries: Array<{ isLoading: boolean; isError: boolean }>;
  onLayerToggle: (layerId: string) => void;
  onCustomLayerRemove: (layerId: string) => void;
  onWMSLayerToggle: (layerId: string) => void;
  onWMSLayerRemove: (layerId: string) => void;
  onAddLayerClick: () => void;
}

export function LayerPanelToggle({
  isOpen,
  onToggle,
  predefinedLayers,
  customLayers,
  wmsLayers,
  queries,
  onLayerToggle,
  onCustomLayerRemove,
  onWMSLayerToggle,
  onWMSLayerRemove,
  onAddLayerClick,
}: LayerPanelToggleProps) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <button
        onClick={() => onToggle(!isOpen)}
        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-2"
        title="Toggle Layers Panel"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <LayerPanel
          predefinedLayers={predefinedLayers}
          customLayers={customLayers}
          wmsLayers={wmsLayers}
          queries={queries}
          onLayerToggle={onLayerToggle}
          onCustomLayerRemove={onCustomLayerRemove}
          onWMSLayerToggle={onWMSLayerToggle}
          onWMSLayerRemove={onWMSLayerRemove}
          onAddLayerClick={onAddLayerClick}
        />
      )}
    </div>
  );
}
