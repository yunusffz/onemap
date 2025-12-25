"use client";

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
        className={`absolute bg-gray-700 top-9 h-7 w-7 text-white hover:bg-gray-100 dark:hover:bg-gray-700  transition-all duration-300 flex items-center justify-center z-30 left-[312px]  ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto delay-200"
            : "opacity-0 pointer-events-none"
        }`}
        title="Collapse sidebar"
        aria-label="Collapse sidebar"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Open button - beside sidebar when collapsed */}
      <button
        onClick={onExpand}
        className={`absolute top-10 h-7 w-7 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 flex items-center justify-center z-30 left-[84px] ${
          isSidebarOpen
            ? "opacity-0"
            : "opacity-100 pointer-events-auto delay-200"
        }`}
        title="Expand sidebar"
        aria-label="Expand sidebar"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </>
  );
}
