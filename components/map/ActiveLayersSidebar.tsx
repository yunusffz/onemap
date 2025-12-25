"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/Logo";
import type { GeoJSONLayerConfig, WMSLayerConfig } from "@/types/map";

interface ActiveLayersSidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  geojsonLayers: GeoJSONLayerConfig[];
  wmsLayers: WMSLayerConfig[];
}

export function ActiveLayersSidebar({
  isOpen,
  onToggle,
  geojsonLayers,
  wmsLayers,
}: ActiveLayersSidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "w-80" : "w-16"
      } absolute left-5 top-5 bottom-5 bg-card text-card-foreground shadow-lg overflow-hidden transition-[width] duration-500 ease-in-out flex flex-col z-20 `}
    >
      {/* Expanded view */}
      <div
        className={`absolute inset-0 p-4 overflow-y-auto flex flex-col transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto delay-200"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex  transition-opacity duration-300 gap-2 items-center`}
        >
          <Logo size={24} className="text-primary" />
          <div className="text-xl text-primary">Map Edge</div>
        </div>
        <div className="flex items-center justify-between mb-4 whitespace-nowrap">
          <h2 className="text-lg font-semibold text-foreground">
            Active Layers
          </h2>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Active Layers List */}
        <div className="space-y-2 overflow-y-auto">
          {geojsonLayers.length === 0 && wmsLayers.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No active layers
            </p>
          ) : (
            <>
              {/* WMS Layers */}
              {wmsLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0 bg-blue-500" />
                    <span className="text-sm font-medium flex-1 min-w-0 truncate">
                      {layer.name}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-mono shrink-0">
                      WMS
                    </span>
                  </div>
                  {layer.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {layer.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 font-mono break-all">
                    {layer.layers}
                  </p>
                </div>
              ))}

              {/* GeoJSON Layers */}
              {geojsonLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: layer.style.color }}
                    />
                    <span className="text-sm font-medium flex-1 text-[20px] min-w-0 truncate">
                      {layer.name}
                    </span>
                  </div>
                  {layer.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {layer.description}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div
        className={`absolute inset-0 flex  transition-opacity duration-300 p-5 ${
          !isOpen
            ? "opacity-100 pointer-events-auto delay-200"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <Logo size={24} className="text-primary" />
      </div>
    </aside>
  );
}
