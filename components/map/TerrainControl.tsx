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
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={`flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white ${
        enabled ? "bg-blue-100 dark:bg-blue-900/30" : ""
      }`}
      title={enabled ? "Disable 3D Terrain" : "Enable 3D Terrain"}
    >
      <Mountain className="h-4 w-4 mr-1" />
      <span className="text-xs">Terrain</span>
      {enabled && (
        <span className="ml-1 text-[10px] text-blue-600 dark:text-blue-400">●</span>
      )}
    </Button>
  );
}
