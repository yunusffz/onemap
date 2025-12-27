"use client";

import { Logo } from "@/components/Logo";
import type { LayerSearchResult } from "@/types/map";
import { SearchInput } from "../ui/search-input";
import { Button } from "../ui/button";
import { ArrowRight } from "@/components/icons";
import { Badge } from "../ui/badge";

interface SearchResultsSidebarProps {
  isOpen: boolean;
  searchResults: LayerSearchResult[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onLayerSelect: (layer: LayerSearchResult) => void;
  selectedLayerId?: string;
  isLoading?: boolean;
}

export function SearchResultsSidebar({
  isOpen,
  searchResults,
  searchQuery,
  onSearchChange,
  onSearch,
  onLayerSelect,
  selectedLayerId,
  isLoading = false,
}: SearchResultsSidebarProps) {
  return (
    <aside
      className={`${
        isOpen ? "w-80" : "w-16"
      } absolute left-5 top-5 bottom-5 bg-card text-card-foreground shadow-lg overflow-hidden transition-[width] duration-500 ease-in-out flex flex-col z-20`}
    >
      {/* Expanded view */}
      <div
        className={`absolute inset-0 p-4 overflow-y-auto flex flex-col transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto delay-200"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex transition-opacity duration-300 gap-2 items-center pb-2.5">
          <Logo size={24} className="text-primary" />
          <div className="text-xl text-primary">Map Edge</div>
        </div>

        <div className="flex items-center justify-between flex-col gap-5 whitespace-nowrap py-5">
          <SearchInput
            placeholder="Find Location/Dataset"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />

          <Button
            className="rounded-none font-normal p-3 w-full justify-between"
            onClick={onSearch}
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="text-sm py-5 text-center text-gray-500">
              Searching for layers...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-sm py-5 flex flex-col gap-5">
              <p>
                Discover 215 geospatial datasets from 22 organizations along
                with real-time Waze data on Civil Insight
              </p>
              <div className="bg-blue-50 p-5 text-center flex flex-col gap-5 justify-center">
                <div className="flex justify-center">
                  <svg
                    width="69"
                    height="69"
                    viewBox="0 0 69 69"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.5 69C53.5538 69 69 53.5538 69 34.5C69 15.4462 53.5538 0 34.5 0C15.4462 0 0 15.4462 0 34.5C0 53.5538 15.4462 69 34.5 69Z"
                      fill="#D4DBF2"
                    />
                    <path
                      d="M55.2001 69H13.8V24.38C15.7514 24.3778 17.6221 23.6017 19.0019 22.2219C20.3817 20.8421 21.1579 18.9713 21.16 17.02H47.84C47.838 17.9866 48.0276 18.9441 48.398 19.8369C48.7684 20.7298 49.3122 21.5403 49.9979 22.2217C50.6792 22.9076 51.4898 23.4515 52.3828 23.822C53.2757 24.1925 54.2333 24.3821 55.2001 24.38V69Z"
                      fill="#F6F8FF"
                    />
                    <path
                      d="M34.5 46.92C40.5972 46.92 45.54 41.9772 45.54 35.88C45.54 29.7828 40.5972 24.84 34.5 24.84C28.4027 24.84 23.46 29.7828 23.46 35.88C23.46 41.9772 28.4027 46.92 34.5 46.92Z"
                      fill="#173DBB"
                    />
                    <path
                      d="M38.4032 41.0844L34.5 37.1811L30.5968 41.0844L29.2957 39.7833L33.1989 35.8801L29.2957 31.9768L30.5968 30.6758L34.5 34.579L38.4032 30.6758L39.7043 31.9768L35.8011 35.8801L39.7043 39.7833L38.4032 41.0844Z"
                      fill="white"
                    />
                    <rect
                      x="23"
                      y="55.2"
                      width="23"
                      height="2.76"
                      fill="#D4DBF2"
                    />
                    <rect
                      x="27.14"
                      y="49.68"
                      width="14.72"
                      height="2.76"
                      fill="#D4DBF2"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="font-medium">No search results found.</div>
                  <p>
                    Try searching for geospatial datasets by name or location.
                    Click "Search" to browse available layers.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-xs text-gray-500 pb-2">
                {searchResults.length} layer{searchResults.length !== 1 ? "s" : ""} found
              </div>
              {searchResults.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => onLayerSelect(layer)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedLayerId === layer.id
                      ? "bg-primary/10 border-2 border-primary"
                      : layer.type === "wms"
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                      : "bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 mt-1"
                      style={{
                        backgroundColor:
                          layer.type === "wms"
                            ? "#3b82f6"
                            : layer.config.style?.color || "#6b7280",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {layer.name}
                      </div>
                      {layer.organization && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {layer.organization}
                        </div>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs shrink-0"
                    >
                      {layer.type.toUpperCase()}
                    </Badge>
                  </div>

                  {layer.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                      {layer.description}
                    </p>
                  )}

                  {layer.category && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {layer.category}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Collapsed view */}
      <div
        className={`absolute inset-0 flex transition-opacity duration-300 p-5 ${
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
