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
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="bg-white dark:bg-gray-800 shadow-md"
    >
      {is3D ? (
        <>
          <Cuboid className="h-4 w-4 mr-2" />
          3D View
        </>
      ) : (
        <>
          <Box className="h-4 w-4 mr-2" />
          2D View
        </>
      )}
    </Button>
  );
}
