"use client";

import { Button } from "@/components/ui/button";
import { Mountain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TerrainControlProps {
  enabled: boolean;
  onToggle: () => void;
}

export function TerrainControl({ enabled, onToggle }: TerrainControlProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={`bg-white dark:bg-gray-800 shadow-md ${
        enabled ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <Mountain className="h-4 w-4 mr-2" />
      3D Terrain
      {enabled && (
        <Badge variant="default" className="ml-2 text-xs px-1.5 py-0">
          ON
        </Badge>
      )}
    </Button>
  );
}
