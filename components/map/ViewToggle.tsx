"use client";

import { Button } from "@/components/ui/button";
import { Box, Cuboid } from "lucide-react";

interface ViewToggleProps {
  is3D: boolean;
  onToggle: () => void;
}

export function ViewToggle({ is3D, onToggle }: ViewToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="flex-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
      title={is3D ? "Switch to 2D View" : "Switch to 3D View"}
    >
      {is3D ? (
        <>
          <Cuboid className="h-4 w-4 mr-1" />
          <span className="text-xs">3D</span>
        </>
      ) : (
        <>
          <Box className="h-4 w-4 mr-1" />
          <span className="text-xs">2D</span>
        </>
      )}
    </Button>
  );
}
