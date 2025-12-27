"use client";

import { useState, useRef } from "react";
import { Map } from "@/components/map/Map";
import { SearchResultsSidebar } from "@/components/map/SearchResultsSidebar";
import { LayerDetailsSidebar } from "@/components/map/LayerDetailsSidebar";
import type { MapRef, LayerDetail } from "@/types/map";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";

interface LayerSearchViewProps {
  // Optional: Callback when layer is added to map
  onAddLayerToMap?: (layer: LayerDetail) => void;
}

export function LayerSearchView({
  onAddLayerToMap,
}: LayerSearchViewProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayer, setSelectedLayer] = useState<LayerDetail | undefined>();
  const [isSearching, setIsSearching] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // Search function (placeholder for now)
  const handleSearch = async () => {
    setIsSearching(true);
    try {
      // Search functionality removed - now using categories API
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapsetClick = (layer: LayerDetail) => {
    setSelectedLayer(layer);
    setIsRightSidebarOpen(true);

    // Center map on layer if bbox is available
    if (layer.metadata?.bbox && mapRef.current) {
      const bbox = layer.metadata.bbox;
      const map = mapRef.current.getMap();

      // Calculate center
      const centerLng = (bbox[0] + bbox[2]) / 2;
      const centerLat = (bbox[1] + bbox[3]) / 2;

      map.flyTo({
        center: [centerLng, centerLat],
        zoom: 12,
        duration: 1000,
      });
    }
  };

  const handleAddToMap = (layer: LayerDetail) => {
    if (onAddLayerToMap) {
      onAddLayerToMap(layer);
    } else {
      // Default behavior: just log
      console.log("Add layer to map:", layer);
    }
    setIsRightSidebarOpen(false);
  };

  const handleCloseDetails = () => {
    setIsRightSidebarOpen(false);
    setSelectedLayer(undefined);
  };

  return (
    <div className="flex h-screen relative">
      {/* Search Results Sidebar (Left) */}
      <SearchResultsSidebar
        isOpen={isLeftSidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onMapsetClick={handleMapsetClick}
        isLoading={isSearching}
      />

      {/* Map Preview (Center - Full Page) */}
      <main className="w-full h-full relative">
        <Map
          mapRef={mapRef}
          initialViewState={DEFAULT_MAP_CONFIG.initialViewState}
          mapStyle={DEFAULT_MAP_CONFIG.mapStyle}
          className="w-full h-full"
        />
      </main>

      {/* Layer Details Sidebar (Right) */}
      <LayerDetailsSidebar
        isOpen={isRightSidebarOpen}
        layer={selectedLayer}
        onClose={handleCloseDetails}
        onAddToMap={handleAddToMap}
      />

      {/* Optional: Toggle buttons for sidebars */}
      <div className="absolute left-5 bottom-5 z-30">
        <button
          onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          className="bg-card text-card-foreground shadow-lg px-3 py-2 rounded text-sm"
        >
          {isLeftSidebarOpen ? "◀" : "▶"} Search
        </button>
      </div>
    </div>
  );
}
