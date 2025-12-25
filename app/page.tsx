"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Map } from "@/components/map/Map";
import { AddLayerDialog } from "@/components/map/AddLayerDialog";
import { ActiveLayersSidebar } from "@/components/map/ActiveLayersSidebar";
import { SidebarToggleButtons } from "@/components/map/SidebarToggleButtons";
import { MapControls } from "@/components/map/MapControls";
import { LayerPanelToggle } from "@/components/map/LayerPanelToggle";
import { useMap } from "@/hooks/useMap";
import { useMapSources } from "@/hooks/useMapSources";
import { useWMSSources } from "@/hooks/useWMSSources";
import { useLayerManager } from "@/hooks/useLayerManager";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";
import { PREDEFINED_LAYERS, GEOJSON_LAYERS } from "@/lib/layerConfig";
import { parseURLMapState } from "@/lib/urlParser";
import type { WMSLayerConfig } from "@/types/map";
import { isWMSLayer } from "@/types/map";

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
      <div className="flex-1 relative">
        {/* Active Layers Sidebar */}
        <ActiveLayersSidebar
          isOpen={isSidebarOpen}
          onToggle={setIsSidebarOpen}
          geojsonLayers={allLayers.filter(layer => layer.visible)}
          wmsLayers={wmsLayers.filter(layer => layer.visible)}
        />

        {/* Sidebar Toggle Buttons */}
        <SidebarToggleButtons
          isSidebarOpen={isSidebarOpen}
          onCollapse={() => setIsSidebarOpen(false)}
          onExpand={() => setIsSidebarOpen(true)}
        />

        {/* Map */}
        <main className="w-full h-full relative">
          {/* Map Controls */}
          <MapControls
            mapStyle={mapStyle}
            onStyleChange={setMapStyle}
            is3DView={is3DView}
            onViewToggle={handleViewToggle}
            terrainEnabled={terrainEnabled}
            onTerrainToggle={handleTerrainToggle}
          />

          {/* Layer Panel Toggle */}
          <LayerPanelToggle
            isOpen={isLayerPanelOpen}
            onToggle={setIsLayerPanelOpen}
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
