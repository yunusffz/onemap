"use client";

import { useState, useRef } from "react";
import { Map } from "@/components/map/Map";
import { SearchResultsSidebar } from "@/components/map/SearchResultsSidebar";
import { LayerDetailsSidebar } from "@/components/map/LayerDetailsSidebar";
import type { MapRef, LayerSearchResult, LayerDetail } from "@/types/map";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";
import { PREDEFINED_LAYERS } from "@/lib/layerConfig";
import { isWMSLayer } from "@/types/map";

interface LayerSearchViewProps {
  // Optional: Allow passing custom search function
  onSearch?: (query: string) => Promise<LayerSearchResult[]>;
  // Optional: Allow passing custom layer detail fetcher
  onFetchLayerDetails?: (layerId: string) => Promise<LayerDetail>;
  // Optional: Callback when layer is added to map
  onAddLayerToMap?: (layer: LayerDetail) => void;
}

export function LayerSearchView({
  onSearch,
  onFetchLayerDetails,
  onAddLayerToMap,
}: LayerSearchViewProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LayerSearchResult[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<LayerDetail | undefined>();
  const [isSearching, setIsSearching] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // Search function using real layers from layerConfig
  const handleSearch = async () => {
    setIsSearching(true);

    try {
      if (onSearch) {
        const results = await onSearch(searchQuery);
        setSearchResults(results);
      } else {
        // Convert PREDEFINED_LAYERS to LayerSearchResult format
        const allLayers: LayerSearchResult[] = PREDEFINED_LAYERS.map((layer) => {
          const isWMS = isWMSLayer(layer);
          return {
            id: layer.id,
            name: layer.name,
            description: layer.description,
            type: isWMS ? "wms" as const : "geojson" as const,
            category: isWMS ? "WMS Service" : "GeoJSON",
            organization: "Map Edge Data Portal",
            config: layer,
          };
        });

        // Filter by search query
        const query = searchQuery.toLowerCase().trim();
        const filteredLayers = query
          ? allLayers.filter(
              (layer) =>
                layer.name.toLowerCase().includes(query) ||
                layer.description?.toLowerCase().includes(query) ||
                layer.category?.toLowerCase().includes(query)
            )
          : allLayers;

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSearchResults(filteredLayers);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLayerSelect = async (layer: LayerSearchResult) => {
    // Convert LayerSearchResult to LayerDetail
    let detailedLayer: LayerDetail;

    if (onFetchLayerDetails) {
      detailedLayer = await onFetchLayerDetails(layer.id);
    } else {
      // Mock detailed data
      detailedLayer = {
        ...layer,
        metadata: {
          createdAt: "2024-01-15",
          updatedAt: "2024-12-20",
          source: "Open Data Portal",
          license: "CC BY 4.0",
          tags: ["geospatial", "public", "verified"],
          featureCount: 1234,
          bbox: [106.8, -6.95, 107.8, -6.85],
        },
      };
    }

    setSelectedLayer(detailedLayer);
    setIsRightSidebarOpen(true);

    // Center map on layer if bbox is available
    if (detailedLayer.metadata?.bbox && mapRef.current) {
      const bbox = detailedLayer.metadata.bbox;
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
        searchResults={searchResults}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onLayerSelect={handleLayerSelect}
        selectedLayerId={selectedLayer?.id}
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
