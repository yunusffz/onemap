"use client";

import { Logo } from "@/components/Logo";
import type { LayerDetail } from "@/types/map";
import { SearchInput } from "../ui/search-input";
import { Button } from "../ui/button";
import { ArrowRight } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchMapsets } from "@/lib/api";
import { useState } from "react";
import type { Mapset } from "@/types/mapset";

interface SearchResultsSidebarProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onMapsetClick: (mapset: LayerDetail) => void;
  isLoading?: boolean;
}

export function SearchResultsSidebar({
  isOpen,
  searchQuery,
  onSearchChange,
  onSearch,
  onMapsetClick,
  isLoading = false,
}: SearchResultsSidebarProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Fetch mapsets when a category is selected
  const { data: mapsetsData, isLoading: isMapsetsLoading } = useQuery({
    queryKey: ["mapsets", selectedCategoryId],
    queryFn: () => fetchMapsets(selectedCategoryId!, {
      is_active: true,
      status_validation: "approved",
    }),
    enabled: !!selectedCategoryId,
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId);
  };

  const convertMapsetToLayerDetail = (mapset: Mapset): LayerDetail => {
    return {
      id: mapset.id,
      name: mapset.name,
      description: mapset.description,
      type: mapset.layer_type === "WMS" ? "wms" : "geojson",
      category: mapset.category.name,
      organization: mapset.producer.name,
      thumbnailUrl: mapset.category.thumbnail,
      config: mapset.layer_type === "WMS" ? {
        id: mapset.id,
        name: mapset.name,
        description: mapset.description,
        baseUrl: mapset.layer_url,
        layers: mapset.name,
        visible: true,
      } : {
        id: mapset.id,
        name: mapset.name,
        description: mapset.description,
        sourceUrl: mapset.layer_url,
        geometryType: "mixed",
        visible: true,
        style: {
          color: "#3b82f6",
          opacity: 0.8,
        },
      },
      metadata: {
        createdAt: mapset.created_at,
        updatedAt: mapset.updated_at,
        source: mapset.producer.name,
      },
    };
  };

  const handleMapsetClick = (mapset: Mapset) => {
    const layerDetail = convertMapsetToLayerDetail(mapset);
    onMapsetClick(layerDetail);
  };

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

        <div className="space-y-1 overflow-y-auto flex-1">
          {isCategoriesLoading ? (
            <div className="text-sm py-3 text-center text-gray-500">
              Loading categories...
            </div>
          ) : categoriesData?.items && categoriesData.items.length > 0 ? (
            <div className="space-y-1">
              {categoriesData.items.map((category) => (
                <div key={category.id}>
                  {/* Category Header */}
                  <div
                    onClick={() => handleCategoryClick(category.id)}
                    className="px-3 py-2 cursor-pointer hover:text-primary transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        selectedCategoryId === category.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Collapsible Mapsets List */}
                  {selectedCategoryId === category.id && (
                    <div>
                      {isMapsetsLoading ? (
                        <div className="text-xs py-3 text-center text-gray-500">
                          Loading layers...
                        </div>
                      ) : mapsetsData?.items && mapsetsData.items.length > 0 ? (
                        <div>
                          {mapsetsData.items.map((mapset) => (
                            <div
                              key={mapset.id}
                              className="px-4 py-2 hover:text-primary transition-colors flex items-center justify-between group cursor-pointer"
                              onClick={() => handleMapsetClick(mapset)}
                            >
                              <div className="flex-1">
                                <div className="text-xs font-medium">{mapset.name}</div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMapsetClick(mapset);
                                }}
                                className="ml-2 w-5 h-5 flex items-center justify-center rounded transition-colors"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs py-3 text-center text-gray-500">
                          No layers found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm py-3 text-center text-gray-500">
              No categories available
            </div>
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
