"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle, Globe } from "lucide-react";
import type { CustomLayerMetadata, WMSLayerConfig } from "@/types/map";
import { detectURLServiceType } from "@/lib/urlDetector";

interface AddLayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLayerAdd: (
    layer: Omit<CustomLayerMetadata, "isCustom" | "createdAt">
  ) => void;
  onWMSLayerAdd?: (layer: Omit<WMSLayerConfig, "id" | "visible">) => void;
}

export function AddLayerDialog({
  open,
  onOpenChange,
  onLayerAdd,
  onWMSLayerAdd,
}: AddLayerDialogProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [layerName, setLayerName] = useState("");
  const [layerUrl, setLayerUrl] = useState("");
  const [layerColor, setLayerColor] = useState("#3b82f6");
  const [layerOpacity, setLayerOpacity] = useState(0.8);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [detectedType, setDetectedType] = useState<string | null>(null);

  // File upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Auto-generate layer name from filename if not provided
      const name = layerName || data.filename.replace(/\.[^/.]+$/, "");

      const newLayer: Omit<CustomLayerMetadata, "isCustom" | "createdAt"> = {
        id: `custom-${Date.now()}`,
        name,
        description: `${data.format.toUpperCase()} layer with ${data.featureCount} features`,
        sourceUrl: data.url,
        geometryType: data.geometryType || "point",
        visible: true,
        style: {
          color: layerColor,
          opacity: layerOpacity,
          strokeWidth,
          fillOpacity: 0.4,
        },
        filename: data.filename,
        format: data.format,
        featureCount: data.featureCount,
      };

      onLayerAdd(newLayer);
      onOpenChange(false);

      // Reset form
      setLayerName("");
      setLayerColor("#3b82f6");
      setLayerOpacity(0.8);
      setStrokeWidth(2);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  // URL-based layer addition
  const urlMutation = useMutation({
    mutationFn: async (url: string) => {
      const serviceType = detectURLServiceType(url);
      setDetectedType(serviceType.type);

      if (serviceType.type === 'wms') {
        return { type: 'wms' as const, config: serviceType.config };
      } else if (serviceType.type === 'geojson') {
        // Fetch GeoJSON to validate and get metadata
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch GeoJSON');
        const data = await response.json();

        // Detect geometry type
        let geometryType: 'point' | 'line' | 'polygon' | 'mixed' = 'point';
        if (data.features && data.features.length > 0) {
          const types = new Set(data.features.map((f: any) => f.geometry?.type));
          if (types.has('Polygon') || types.has('MultiPolygon')) geometryType = 'polygon';
          else if (types.has('LineString') || types.has('MultiLineString')) geometryType = 'line';
          else if (types.size > 1) geometryType = 'mixed';
        }

        return {
          type: 'geojson' as const,
          url,
          featureCount: data.features?.length || 0,
          geometryType,
        };
      } else if (serviceType.type === 'arcgis') {
        throw new Error('ArcGIS services are not yet supported. Coming soon!');
      } else {
        throw new Error('Unknown or unsupported URL type. Please provide a WMS or GeoJSON URL.');
      }
    },
    onSuccess: (result) => {
      if (result.type === 'wms' && onWMSLayerAdd) {
        // Add WMS layer
        const wmsLayer: Omit<WMSLayerConfig, "id" | "visible"> = {
          ...result.config,
          name: layerName || result.config.name,
          opacity: layerOpacity,
        };
        onWMSLayerAdd(wmsLayer);
      } else if (result.type === 'geojson') {
        // Add GeoJSON layer
        const geoJsonLayer: Omit<CustomLayerMetadata, "isCustom" | "createdAt"> = {
          id: `custom-url-${Date.now()}`,
          name: layerName || 'GeoJSON Layer',
          description: `GeoJSON layer with ${result.featureCount} features`,
          sourceUrl: result.url,
          geometryType: result.geometryType,
          visible: true,
          style: {
            color: layerColor,
            opacity: layerOpacity,
            strokeWidth,
            fillOpacity: 0.4,
          },
        };
        onLayerAdd(geoJsonLayer);
      }

      onOpenChange(false);

      // Reset form
      setLayerName("");
      setLayerUrl("");
      setLayerColor("#3b82f6");
      setLayerOpacity(0.8);
      setStrokeWidth(2);
      setDetectedType(null);
    },
  });

  const handleUrlSubmit = () => {
    if (!layerUrl.trim()) return;
    urlMutation.mutate(layerUrl);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={true}>
      <SheetContent
        side="right"
        className="sm:max-w-lg overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Add Custom Layer</SheetTitle>
          <SheetDescription>
            Upload a file or provide a URL to add a custom map layer
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "upload" | "url")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="url">From URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".geojson,.json,.kml,.kmz,.zip,.gpx,.csv"
                  onChange={handleFileUpload}
                  disabled={uploadMutation.isPending}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supported: GeoJSON, KML, KMZ, Shapefile (.zip), GPX, CSV
                </p>
              </div>

              {uploadMutation.isPending && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing file...</span>
                </div>
              )}

              {uploadMutation.isError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>{uploadMutation.error.message}</span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="url-input">Layer URL</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com/geoserver/wms or https://example.com/data.geojson"
                  value={layerUrl}
                  onChange={(e) => setLayerUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUrlSubmit();
                    }
                  }}
                  disabled={urlMutation.isPending}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Globe className="inline h-3 w-3 mr-1" />
                  Supports: WMS (GeoServer, MapServer), GeoJSON, ArcGIS (coming soon)
                </p>

                {detectedType && (
                  <div className="mt-2 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    Detected: {detectedType.toUpperCase()}
                  </div>
                )}
              </div>

              <Button
                onClick={handleUrlSubmit}
                disabled={!layerUrl.trim() || urlMutation.isPending}
                className="w-full"
              >
                {urlMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Detecting and loading...
                  </>
                ) : (
                  'Add Layer'
                )}
              </Button>

              {urlMutation.isPending && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing URL...</span>
                </div>
              )}

              {urlMutation.isError && (
                <div className="flex items-start gap-2 text-sm text-red-600">
                  <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{urlMutation.error.message}</span>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Style Configuration */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-sm text-foreground">Layer Style</h3>

            <div>
              <Label htmlFor="layer-name">Layer Name</Label>
              <Input
                id="layer-name"
                value={layerName}
                onChange={(e) => setLayerName(e.target.value)}
                placeholder="My Custom Layer"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="layer-color">Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="layer-color"
                  type="color"
                  value={layerColor}
                  onChange={(e) => setLayerColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={layerColor}
                  onChange={(e) => setLayerColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="opacity">
                Opacity: {layerOpacity.toFixed(2)}
              </Label>
              <Slider
                id="opacity"
                min={0}
                max={1}
                step={0.1}
                value={[layerOpacity]}
                onValueChange={([value]) => setLayerOpacity(value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="stroke-width">
                Stroke Width: {strokeWidth}px
              </Label>
              <Slider
                id="stroke-width"
                min={1}
                max={10}
                step={1}
                value={[strokeWidth]}
                onValueChange={([value]) => setStrokeWidth(value)}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
