"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Map } from "@/components/map/Map";
import { MapMarker } from "@/components/map/MapMarker";
import { MapPopup } from "@/components/map/MapPopup";
import { StyleSwitcher } from "@/components/map/StyleSwitcher";
import { TerrainControl } from "@/components/map/TerrainControl";
import { ViewToggle } from "@/components/map/ViewToggle";
import { useMap } from "@/hooks/useMap";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";

interface Location {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  description: string;
}

// Example: Fetch locations using TanStack Query
async function fetchLocations(): Promise<Location[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      name: "San Francisco",
      longitude: -122.4194,
      latitude: 37.7749,
      description: "The Golden Gate City",
    },
    {
      id: "2",
      name: "Oakland",
      longitude: -122.2711,
      latitude: 37.8044,
      description: "The Town",
    },
    {
      id: "3",
      name: "Berkeley",
      longitude: -122.2728,
      latitude: 37.8716,
      description: "Home of UC Berkeley",
    },
  ];
}

export default function Home() {
  const { mapRef, flyTo, toggleView } = useMap();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapStyle, setMapStyle] = useState(DEFAULT_MAP_CONFIG.mapStyle);
  const [terrainEnabled, setTerrainEnabled] = useState(false);
  const [is3DView, setIs3DView] = useState(false);

  // Using TanStack Query to fetch locations
  const { data: locations, isLoading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    flyTo({
      longitude: location.longitude,
      latitude: location.latitude,
      zoom: 13,
    });
  };

  const handleViewToggle = () => {
    const newIs3D = !is3DView;
    setIs3DView(newIs3D);
    toggleView(newIs3D);
  };

  const handleTerrainToggle = () => {
    setTerrainEnabled(!terrainEnabled);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            MapLibre Boilerplate
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Next.js + Tailwind + TanStack Query + MapLibre GL
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-80 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Locations
            </h2>

            {isLoading && (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">
                  Error loading locations
                </p>
              </div>
            )}

            {locations && (
              <div className="space-y-2">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleMarkerClick(location)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedLocation?.id === location.id
                        ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                        : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    } border`}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {location.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          {/* Map Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <StyleSwitcher currentStyle={mapStyle} onStyleChange={setMapStyle} />
            <ViewToggle is3D={is3DView} onToggle={handleViewToggle} />
            <TerrainControl enabled={terrainEnabled} onToggle={handleTerrainToggle} />
          </div>

          <Map
            mapRef={mapRef}
            initialViewState={{
              longitude: -122.4,
              latitude: 37.8,
              zoom: 11,
            }}
            mapStyle={mapStyle}
            terrain={terrainEnabled}
            className="w-full h-full"
          >
            {locations?.map((location) => (
              <MapMarker
                key={location.id}
                longitude={location.longitude}
                latitude={location.latitude}
                onClick={() => handleMarkerClick(location)}
              />
            ))}

            {selectedLocation && (
              <MapPopup
                longitude={selectedLocation.longitude}
                latitude={selectedLocation.latitude}
                onClose={() => setSelectedLocation(null)}
              >
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedLocation.description}
                  </p>
                </div>
              </MapPopup>
            )}
          </Map>
        </main>
      </div>
    </div>
  );
}
