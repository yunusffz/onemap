"use client";

import { ChevronLeft, ChevronRight } from "@/components/icons";

interface SidebarToggleButtonsProps {
  isSidebarOpen: boolean;
  onCollapse: () => void;
  onExpand: () => void;
}

export function SidebarToggleButtons({
  isSidebarOpen,
  onCollapse,
  onExpand,
}: SidebarToggleButtonsProps) {
  return (
    <>
      {/* Close button - beside sidebar when expanded */}
      <button
        onClick={onCollapse}
        className={`absolute bg-gray-700 top-9 h-7 w-7 text-white cursor-pointer hover:bg-primary transition-all duration-500 ease-in-out flex items-center justify-center z-30 ${
          isSidebarOpen
            ? "left-[312px] opacity-100 pointer-events-auto duration-75"
            : "left-[84px] opacity-0 pointer-events-none"
        }`}
        title="Collapse sidebar"
        aria-label="Collapse sidebar"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Open button - beside sidebar when collapsed */}
      <button
        onClick={onExpand}
        className={`absolute top-10 h-7 w-7 bg-primary hover:bg-primary/90 cursor-pointer text-white shadow-lg transition-all duration-500 ease-in-out flex items-center justify-center z-30 ${
          isSidebarOpen
            ? "left-[312px] opacity-0 pointer-events-none"
            : "left-[84px] opacity-100 pointer-events-auto duration-75"
        }`}
        title="Expand sidebar"
        aria-label="Expand sidebar"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </>
  );
}
