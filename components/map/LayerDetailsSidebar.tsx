"use client";

import type { LayerDetail } from "@/types/map";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { X } from "lucide-react";

interface LayerDetailsSidebarProps {
  isOpen: boolean;
  layer?: LayerDetail;
  onClose: () => void;
  onAddToMap?: (layer: LayerDetail) => void;
}

export function LayerDetailsSidebar({
  isOpen,
  layer,
  onClose,
  onAddToMap,
}: LayerDetailsSidebarProps) {
  if (!layer) return null;

  return (
    <aside
      className={`${
        isOpen ? "w-80" : "w-0"
      } absolute right-5 top-5 bottom-5 bg-card text-card-foreground shadow-lg overflow-hidden transition-[width] duration-500 ease-in-out flex flex-col z-20`}
    >
      <div
        className={`absolute inset-0 p-4 overflow-y-auto flex flex-col transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto delay-200"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{layer.name}</h2>
            {layer.organization && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {layer.organization}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Type and Category Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge variant="outline">{layer.type.toUpperCase()}</Badge>
          {layer.category && (
            <Badge variant="secondary">{layer.category}</Badge>
          )}
        </div>

        {/* Thumbnail */}
        {layer.thumbnailUrl && (
          <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={layer.thumbnailUrl}
              alt={layer.name}
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {/* Description */}
        {layer.description && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Description</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {layer.description}
            </p>
          </div>
        )}

        <Separator className="my-4" />

        {/* Metadata */}
        {layer.metadata && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Details</h3>

            {layer.metadata.source && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Source
                </div>
                <div className="text-sm">{layer.metadata.source}</div>
              </div>
            )}

            {layer.metadata.license && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  License
                </div>
                <div className="text-sm">{layer.metadata.license}</div>
              </div>
            )}

            {layer.metadata.featureCount !== undefined && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Features
                </div>
                <div className="text-sm">
                  {layer.metadata.featureCount.toLocaleString()}
                </div>
              </div>
            )}

            {layer.metadata.createdAt && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Created
                </div>
                <div className="text-sm">
                  {new Date(layer.metadata.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}

            {layer.metadata.updatedAt && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Last Updated
                </div>
                <div className="text-sm">
                  {new Date(layer.metadata.updatedAt).toLocaleDateString()}
                </div>
              </div>
            )}

            {layer.metadata.tags && layer.metadata.tags.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Tags
                </div>
                <div className="flex flex-wrap gap-1">
                  {layer.metadata.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {layer.metadata.bbox && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Bounding Box
                </div>
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                  West: {layer.metadata.bbox[0].toFixed(4)}
                  <br />
                  South: {layer.metadata.bbox[1].toFixed(4)}
                  <br />
                  East: {layer.metadata.bbox[2].toFixed(4)}
                  <br />
                  North: {layer.metadata.bbox[3].toFixed(4)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical Info */}
        <Separator className="my-4" />
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Technical Information</h3>

          {layer.type === "geojson" && (
            <>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Geometry Type
                </div>
                <div className="text-sm capitalize">
                  {layer.config.geometryType}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Source URL
                </div>
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                  {layer.config.sourceUrl}
                </div>
              </div>
            </>
          )}

          {layer.type === "wms" && (
            <>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Base URL
                </div>
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all">
                  {layer.config.baseUrl}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Layers
                </div>
                <div className="text-sm">{layer.config.layers}</div>
              </div>
              {layer.config.version && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    WMS Version
                  </div>
                  <div className="text-sm">{layer.config.version}</div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4 space-y-2">
          {onAddToMap && (
            <Button
              className="w-full rounded-none"
              onClick={() => onAddToMap(layer)}
            >
              Add to Map
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full rounded-none"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </aside>
  );
}
