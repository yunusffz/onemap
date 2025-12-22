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
import { Loader2, XCircle } from "lucide-react";
import type { CustomLayerMetadata } from "@/types/map";

interface AddLayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLayerAdd: (
    layer: Omit<CustomLayerMetadata, "isCustom" | "createdAt">
  ) => void;
}

export function AddLayerDialog({
  open,
  onOpenChange,
  onLayerAdd,
}: AddLayerDialogProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [layerName, setLayerName] = useState("");
  const [layerColor, setLayerColor] = useState("#3b82f6");
  const [layerOpacity, setLayerOpacity] = useState(0.8);
  const [strokeWidth, setStrokeWidth] = useState(2);

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
                  placeholder="https://example.com/data.geojson"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  URL to GeoJSON file (coming soon)
                </p>
              </div>
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
