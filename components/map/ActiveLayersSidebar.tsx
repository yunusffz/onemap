"use client";

import { Logo } from "@/components/Logo";
import type { GeoJSONLayerConfig, WMSLayerConfig } from "@/types/map";
import { SearchInput } from "../ui/search-input";
import { Button } from "../ui/button";
import { ArrowRight, MapPin, Ruler } from "@/components/icons";
import { ButtonGroup } from "../ui/button-group";
import { Polygon } from "../icons/custom";

interface ActiveLayersSidebarProps {
  isOpen: boolean;
  geojsonLayers: GeoJSONLayerConfig[];
  wmsLayers: WMSLayerConfig[];
}

export function ActiveLayersSidebar({
  isOpen,
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
          className={`flex  transition-opacity duration-300 gap-2 items-center pb-2.5`}
        >
          <Logo size={24} className="text-primary" />
          <div className="text-xl text-primary">Map Edge</div>
        </div>
        <div className="flex items-center justify-between flex-col gap-5 whitespace-nowrap py-5">
          <SearchInput placeholder="Find Location/Dataset" />

          <Button className="rounded-none font-normal p-3 w-full justify-between">
            Search
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="py-5 flex-col gap-5">
          <ButtonGroup className="rounded-none mb-5 flex w-full">
            <Button
              className="rounded-none bg-gray-300 flex-1 border-0 shadow-none cursor-pointer hover:text-primary transition-colors"
              variant={"secondary"}
            >
              <MapPin className="w-5 h-5" />
            </Button>
            <Button
              className="rounded-none bg-gray-300 flex-1 border-0 shadow-none cursor-pointer hover:text-primary transition-colors"
              variant={"secondary"}
            >
              <Ruler className="w-5 h-5" />
            </Button>
            <Button
              className="rounded-none bg-gray-300 flex-1 border-0 shadow-none cursor-pointer hover:text-primary transition-colors"
              variant={"secondary"}
            >
              <Polygon />
            </Button>
          </ButtonGroup>

          <Button
            className="rounded-none w-full cursor-pointer"
            variant={"outline"}
          >
            Reset
          </Button>
        </div>

        <div className="space-y-2 overflow-y-auto">
          {geojsonLayers.length === 0 && wmsLayers.length === 0 ? (
            <div className="text-sm  py-5 flex flex-col gap-5">
              <p>
                Discover 215 geospatial datasets from 22 organizations along
                with real-time Waze data on Civil Insight
              </p>
              <div className="bg-blue-50 p-5 text-center flex flex-col gap-5 justify-center ">
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
                  <div className="font-medium">
                    No geospatial datasets have been selected yet.
                  </div>
                  <p>
                    Click "Explore Data" to browse the geospatial datasets that
                    will be displayed on the map. Enable "waze" data to show
                    real-time traffic condition data.
                  </p>
                </div>
              </div>
            </div>
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
