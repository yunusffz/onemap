"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Map } from "@/components/map/Map";
import { StyleSwitcher } from "@/components/map/StyleSwitcher";
import { TerrainControl } from "@/components/map/TerrainControl";
import { ViewToggle } from "@/components/map/ViewToggle";
import { LayerPanel } from "@/components/map/LayerPanel";
import { AddLayerDialog } from "@/components/map/AddLayerDialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useMap } from "@/hooks/useMap";
import { useMapSources } from "@/hooks/useMapSources";
import { useWMSSources } from "@/hooks/useWMSSources";
import { useLayerManager } from "@/hooks/useLayerManager";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";
import { PREDEFINED_LAYERS, GEOJSON_LAYERS } from "@/lib/layerConfig";
import { parseURLMapState } from "@/lib/urlParser";
import type { WMSLayerConfig } from "@/types/map";
import { isWMSLayer, isGeoJSONLayer } from "@/types/map";

function HomeContent() {
  const { mapRef, toggleView } = useMap();
  const searchParams = useSearchParams();
  const [mapStyle, setMapStyle] = useState(DEFAULT_MAP_CONFIG.mapStyle);
  const [terrainEnabled, setTerrainEnabled] = useState(false);
  const [is3DView, setIs3DView] = useState(false);
  const [isAddLayerOpen, setIsAddLayerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true);

  // Parse URL parameters for WMS layers and view state
  // Initialize with predefined WMS layers
  const predefinedWMSLayers = PREDEFINED_LAYERS.filter(isWMSLayer);
  const [wmsLayers, setWmsLayers] = useState<WMSLayerConfig[]>(predefinedWMSLayers);
  const [initialViewState, setInitialViewState] = useState({
    longitude: 107.6191,
    latitude: -6.9175,
    zoom: 12,
  });

  useEffect(() => {
    const urlState = parseURLMapState(searchParams);

    if (urlState.wmsLayers.length > 0) {
      // Combine predefined and URL WMS layers
      setWmsLayers([...predefinedWMSLayers, ...urlState.wmsLayers]);
    }

    if (urlState.viewState) {
      setInitialViewState(urlState.viewState);
    }
  }, [searchParams]);

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

  // Load WMS layers from URL
  useWMSSources(mapRef, wmsLayers);

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

  const handleWMSLayerAdd = (wmsConfig: Omit<WMSLayerConfig, "id" | "visible">) => {
    const newLayer: WMSLayerConfig = {
      ...wmsConfig,
      id: `wms-${Date.now()}`,
      visible: true,
    };
    setWmsLayers((prev) => [...prev, newLayer]);
  };

  const handleWMSLayerToggle = (layerId: string) => {
    setWmsLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const handleWMSLayerRemove = (layerId: string) => {
    setWmsLayers((prev) => prev.filter((layer) => layer.id !== layerId));
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Collapsible Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-80" : "w-0"
          } bg-card text-card-foreground shadow-lg overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <div className={`p-4 ${isSidebarOpen ? "" : "hidden"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Active Layers</h2>
              <ThemeToggle />
            </div>

            {/* Active Layers List */}
            <div className="space-y-2">
              {allLayers.filter(layer => layer.visible).length === 0 && wmsLayers.filter(layer => layer.visible).length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No active layers
                </p>
              ) : (
                <>
                  {/* WMS Layers */}
                  {wmsLayers.filter(layer => layer.visible).map((layer) => (
                    <div
                      key={layer.id}
                      className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 bg-blue-500" />
                        <span className="text-sm font-medium flex-1">{layer.name}</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">WMS</span>
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
                  {allLayers.filter(layer => layer.visible).map((layer) => (
                    <div
                      key={layer.id}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: layer.style.color }}
                        />
                        <span className="text-sm font-medium flex-1  text-[20px]">{layer.name}</span>
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
        </aside>

        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg rounded-r-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
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
            <div className="bg-card text-card-foreground shadow-lg rounded-lg p-2 flex flex-col gap-1">
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
                wmsLayers={wmsLayers}
                queries={queries}
                onLayerToggle={handleLayerToggle}
                onCustomLayerRemove={removeCustomLayer}
                onWMSLayerToggle={handleWMSLayerToggle}
                onWMSLayerRemove={handleWMSLayerRemove}
                onAddLayerClick={() => setIsAddLayerOpen(true)}
              />
            )}
          </div>

          <Map
            mapRef={mapRef}
            initialViewState={initialViewState}
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
        onWMSLayerAdd={handleWMSLayerAdd}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
