"use client";

import { useState } from "react";
import { MAP_STYLE_OPTIONS } from "@/lib/mapConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Map as MapIcon } from "lucide-react";

interface StyleSwitcherProps {
  currentStyle: string;
  onStyleChange: (styleUrl: string) => void;
}

export function StyleSwitcher({ currentStyle, onStyleChange }: StyleSwitcherProps) {
  const currentStyleOption = MAP_STYLE_OPTIONS.find(
    (style) => style.url === currentStyle
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-800 shadow-md"
        >
          <MapIcon className="h-4 w-4 mr-2" />
          {currentStyleOption?.name || "Map Style"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {MAP_STYLE_OPTIONS.map((style) => (
          <DropdownMenuItem
            key={style.id}
            onClick={() => onStyleChange(style.url)}
            className={currentStyle === style.url ? "bg-accent" : ""}
          >
            {style.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
