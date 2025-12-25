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
        className={`absolute top-4 h-10 w-10 bg-card hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-30 border-2 border-border ${
          isSidebarOpen ? "opacity-100 pointer-events-auto delay-200 left-[308px]" : "opacity-0 pointer-events-none left-4"
        }`}
        style={{
          left: isSidebarOpen ? 'calc(320px - 12px)' : '52px'
        }}
        title="Collapse sidebar"
        aria-label="Collapse sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Open button - beside sidebar when collapsed */}
      <button
        onClick={onExpand}
        className={`absolute top-4 h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-30 ${
          isSidebarOpen ? "opacity-0 pointer-events-none left-[308px]" : "opacity-100 pointer-events-auto delay-200 left-[52px]"
        }`}
        style={{
          left: isSidebarOpen ? 'calc(320px - 12px)' : '52px'
        }}
        title="Expand sidebar"
        aria-label="Expand sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );
}
