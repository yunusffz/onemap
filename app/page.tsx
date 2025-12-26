"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Map } from "@/components/map/Map";
import { AddLayerDialog } from "@/components/map/AddLayerDialog";
import { ActiveLayersSidebar } from "@/components/map/ActiveLayersSidebar";
import { SidebarToggleButtons } from "@/components/map/SidebarToggleButtons";
import { MapControls } from "@/components/map/MapControls";
import { LayerPanelToggle } from "@/components/map/LayerPanelToggle";
import { DrawControl } from "@/components/map/DrawControl";
import { useMap } from "@/hooks/useMap";
import { useMapSources } from "@/hooks/useMapSources";
import { useWMSSources } from "@/hooks/useWMSSources";
import { useActiveLayers } from "@/hooks/useActiveLayers";
import { useDrawing } from "@/hooks/useDrawing";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";
import { PREDEFINED_LAYERS, GEOJSON_LAYERS } from "@/lib/layerConfig";
import { parseURLMapState } from "@/lib/urlParser";
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
  const [isMapMounted, setIsMapMounted] = useState(false);

  // Parse URL parameters for WMS layers and view state
  const predefinedWMSLayers = PREDEFINED_LAYERS.filter(isWMSLayer);
  const [initialViewState, setInitialViewState] = useState({
    longitude: 107.6191,
    latitude: -6.9175,
    zoom: 12,
  });

  useEffect(() => {
    const urlState = parseURLMapState(searchParams);

    if (urlState.viewState) {
      setInitialViewState(urlState.viewState);
    }
  }, [searchParams]);

  // Single source of truth for all active layers
  const {
    predefinedGeoJSON,
    customGeoJSON,
    allGeoJSONLayers,
    activeGeoJSONLayers,
    addCustomLayer,
    removeCustomLayer,
    toggleGeoJSONLayerVisibility,
    wmsLayers,
    activeWMSLayers,
    addWMSLayer,
    toggleWMSLayerVisibility,
    removeWMSLayer,
  } = useActiveLayers({
    predefinedGeoJSONLayers: GEOJSON_LAYERS,
    predefinedWMSLayers,
    isMounted: isMapMounted,
  });

  const { queries } = useMapSources(mapRef, allGeoJSONLayers);

  // Load WMS layers
  useWMSSources(mapRef, wmsLayers);

  // Drawing functionality
  const { mode, setDrawMode, addMeasurement, removeMeasurement, clearAll } =
    useDrawing();

  // Track map mount/unmount
  useEffect(() => {
    setIsMapMounted(true);
    return () => {
      setIsMapMounted(false);
    };
  }, []);

  const handleViewToggle = () => {
    const newIs3D = !is3DView;
    setIs3DView(newIs3D);
    toggleView(newIs3D);
  };

  const handleTerrainToggle = () => {
    setTerrainEnabled(!terrainEnabled);
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Active Layers Sidebar */}
        <ActiveLayersSidebar
          isOpen={isSidebarOpen}
          geojsonLayers={activeGeoJSONLayers}
          wmsLayers={activeWMSLayers}
          drawMode={mode}
          onDrawModeChange={setDrawMode}
          onReset={clearAll}
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
            predefinedLayers={predefinedGeoJSON}
            customLayers={customGeoJSON}
            wmsLayers={wmsLayers}
            queries={queries}
            onLayerToggle={toggleGeoJSONLayerVisibility}
            onCustomLayerRemove={removeCustomLayer}
            onWMSLayerToggle={toggleWMSLayerVisibility}
            onWMSLayerRemove={removeWMSLayer}
            onAddLayerClick={() => setIsAddLayerOpen(true)}
          />

          <Map
            mapRef={mapRef}
            initialViewState={initialViewState}
            mapStyle={mapStyle}
            terrain={terrainEnabled}
            className="w-full h-full"
          >
            <DrawControl
              mapRef={mapRef}
              mode={mode}
              onMeasurement={addMeasurement}
              onDelete={removeMeasurement}
            />
          </Map>
        </main>
      </div>

      {/* Add Layer Dialog */}
      <AddLayerDialog
        open={isAddLayerOpen}
        onOpenChange={setIsAddLayerOpen}
        onLayerAdd={addCustomLayer}
        onWMSLayerAdd={addWMSLayer}
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
