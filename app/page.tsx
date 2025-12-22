"use client";

import { useState } from "react";
import { Map } from "@/components/map/Map";
import { StyleSwitcher } from "@/components/map/StyleSwitcher";
import { TerrainControl } from "@/components/map/TerrainControl";
import { ViewToggle } from "@/components/map/ViewToggle";
import { LayerPanel } from "@/components/map/LayerPanel";
import { AddLayerDialog } from "@/components/map/AddLayerDialog";
import { useMap } from "@/hooks/useMap";
import { useMapSources } from "@/hooks/useMapSources";
import { useLayerManager } from "@/hooks/useLayerManager";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";
import { GEOJSON_LAYERS } from "@/lib/layerConfig";

export default function Home() {
  const { mapRef, toggleView } = useMap();
  const [mapStyle, setMapStyle] = useState(DEFAULT_MAP_CONFIG.mapStyle);
  const [terrainEnabled, setTerrainEnabled] = useState(false);
  const [is3DView, setIs3DView] = useState(false);
  const [isAddLayerOpen, setIsAddLayerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);

  // Manage GeoJSON layers (predefined + custom)
  const {
    predefinedLayers,
    customLayers,
    allLayers,
    addCustomLayer,
    removeCustomLayer,
    toggleLayerVisibility,
  } = useLayerManager(GEOJSON_LAYERS);

  const { queries } = useMapSources(mapRef, allLayers);

  const handleViewToggle = () => {
    const newIs3D = !is3DView;
    setIs3DView(newIs3D);
    toggleView(newIs3D);
  };

  const handleTerrainToggle = () => {
    setTerrainEnabled(!terrainEnabled);
  };

  const handleLayerToggle = (layerId: string) => {
    toggleLayerVisibility(layerId);
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Collapsible Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-80" : "w-0"
          } bg-white! dark:bg-gray-800! text-gray-900! dark:text-white! shadow-lg overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <div className={`p-4 ${isSidebarOpen ? "" : "hidden"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Active Layers</h2>
            </div>

            {/* Active Layers List */}
            <div className="space-y-2">
              {allLayers.filter(layer => layer.visible).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No active layers
                </p>
              ) : (
                allLayers.filter(layer => layer.visible).map((layer) => (
                  <div
                    key={layer.id}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: layer.style.color }}
                      />
                      <span className="text-sm font-medium flex-1">{layer.name}</span>
                    </div>
                    {layer.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {layer.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-r-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          style={{ left: isSidebarOpen ? "320px" : "0" }}
        >
          {isSidebarOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>

        {/* Map */}
        <main className="flex-1 relative">
          {/* Compact Map Controls - Top Right */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {/* Compact Control Group */}
            <div className="bg-white! dark:bg-gray-800! text-gray-900! dark:text-white! shadow-lg rounded-lg p-2 flex flex-col gap-1">
              <StyleSwitcher currentStyle={mapStyle} onStyleChange={setMapStyle} />
              <div className="flex gap-1">
                <ViewToggle is3D={is3DView} onToggle={handleViewToggle} />
                <TerrainControl enabled={terrainEnabled} onToggle={handleTerrainToggle} />
              </div>
            </div>
          </div>

          {/* Layer Panel Toggle - Top Left */}
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-2"
              title="Toggle Layers Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {isLayerPanelOpen && (
              <LayerPanel
                predefinedLayers={predefinedLayers}
                customLayers={customLayers}
                queries={queries}
                onLayerToggle={handleLayerToggle}
                onCustomLayerRemove={removeCustomLayer}
                onAddLayerClick={() => setIsAddLayerOpen(true)}
              />
            )}
          </div>

          <Map
            mapRef={mapRef}
            initialViewState={{
              longitude: 107.6191,
              latitude: -6.9175,
              zoom: 12,
            }}
            mapStyle={mapStyle}
            terrain={terrainEnabled}
            className="w-full h-full"
          />
        </main>
      </div>

      {/* Add Layer Dialog */}
      <AddLayerDialog
        open={isAddLayerOpen}
        onOpenChange={setIsAddLayerOpen}
        onLayerAdd={addCustomLayer}
      />
    </div>
  );
}
