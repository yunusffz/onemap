"use client";

import { StyleSwitcher } from "@/components/map/StyleSwitcher";
import { ViewToggle } from "@/components/map/ViewToggle";
import { TerrainControl } from "@/components/map/TerrainControl";

interface MapControlsProps {
  mapStyle: string;
  onStyleChange: (style: string) => void;
  is3DView: boolean;
  onViewToggle: () => void;
  terrainEnabled: boolean;
  onTerrainToggle: () => void;
}

export function MapControls({
  mapStyle,
  onStyleChange,
  is3DView,
  onViewToggle,
  terrainEnabled,
  onTerrainToggle,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <div className="bg-card text-card-foreground shadow-lg rounded-lg p-2 flex flex-col gap-1">
        <StyleSwitcher currentStyle={mapStyle} onStyleChange={onStyleChange} />
        <div className="flex gap-1">
          <ViewToggle is3D={is3DView} onToggle={onViewToggle} />
          <TerrainControl enabled={terrainEnabled} onToggle={onTerrainToggle} />
        </div>
      </div>
    </div>
  );
}
