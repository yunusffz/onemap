# OneMap - Project Architecture

This document describes the architecture, patterns, and conventions used in the OneMap project.

## Project Overview

OneMap is a Next.js-based map application built with MapLibre GL, React, TypeScript, and Tailwind CSS. It supports GeoJSON and WMS layers with a modern, dark-mode-enabled UI.

## Technology Stack

- **Framework**: Next.js 16.1.0 (with Turbopack)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Mapping**: MapLibre GL JS (via react-map-gl)
- **Theme**: next-themes for dark mode support
- **Font**: Satoshi (custom font family)

## Directory Structure

```
/home/yunus/Projects/onemap/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page with map interface (~178 lines)
│   ├── layout.tsx                # Root layout with theme provider
│   ├── globals.css               # Global styles and Tailwind imports
│   └── fonts.ts                  # Font configuration (Satoshi)
│
├── components/
│   ├── map/                      # Map-specific feature components (PascalCase)
│   │   ├── Map.tsx               # Main map wrapper component
│   │   ├── MapControls.tsx       # Top-right control group
│   │   ├── ActiveLayersSidebar.tsx # Collapsible sidebar for active layers
│   │   ├── SidebarToggleButtons.tsx # Sidebar expand/collapse buttons
│   │   ├── LayerPanel.tsx        # Layer management panel
│   │   ├── LayerPanelToggle.tsx  # Toggle button + panel wrapper
│   │   ├── AddLayerDialog.tsx    # Dialog for adding custom layers
│   │   ├── StyleSwitcher.tsx     # Map style dropdown
│   │   ├── ViewToggle.tsx        # 2D/3D view toggle button
│   │   ├── TerrainControl.tsx    # Terrain enable/disable button
│   │   ├── MapMarker.tsx         # Map marker component
│   │   └── MapPopup.tsx          # Map popup component
│   │
│   └── ui/                       # Reusable UI primitives (kebab-case)
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── search-input.tsx
│       ├── sheet.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       └── theme-toggle.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useMap.ts                 # Map instance and view management
│   ├── useMapSources.ts          # GeoJSON source management
│   ├── useWMSSources.ts          # WMS layer management
│   └── useLayerManager.ts        # Layer visibility and CRUD operations
│
├── lib/                          # Utilities and configurations
│   ├── mapConfig.ts              # Default map configuration
│   ├── layerConfig.ts            # Predefined layer definitions
│   ├── urlParser.ts              # URL parameter parsing for WMS layers
│   └── utils.ts                  # Utility functions (cn, etc.)
│
├── types/                        # TypeScript type definitions
│   └── map.ts                    # Map-related interfaces and types
│
└── public/                       # Static assets
    └── geojson/                  # GeoJSON layer files
```

## Component Architecture

### Component Types

#### 1. Map Components (`/components/map/`)
**Purpose**: Feature-specific, higher-level components for map functionality

**Conventions**:
- **File naming**: PascalCase (e.g., `MapControls.tsx`, `ActiveLayersSidebar.tsx`)
- **Export style**: Named exports
- **Client directive**: Always use `"use client"` at the top
- **State management**: Fully controlled components (no internal state)
- **Props interface**: Explicit TypeScript interface named `{ComponentName}Props`

**Example Pattern**:
```typescript
"use client";

import { SomeUIComponent } from "@/components/ui/some-ui-component";
import type { SomeType } from "@/types/map";

interface MapControlsProps {
  mapStyle: string;
  onStyleChange: (style: string) => void;
  // ... other props
}

export function MapControls({
  mapStyle,
  onStyleChange,
}: MapControlsProps) {
  return (
    // JSX here
  );
}
```

#### 2. UI Components (`/components/ui/`)
**Purpose**: Reusable, primitive UI components (shadcn/ui based)

**Conventions**:
- **File naming**: kebab-case (e.g., `theme-toggle.tsx`, `dropdown-menu.tsx`)
- **Export style**: Named exports + variant exports
- **Pattern**: Use `React.forwardRef` for DOM elements
- **Variants**: Use `class-variance-authority` (cva) for variant management
- **Utilities**: Use `cn()` from `@/lib/utils` for className merging
- **Display name**: Set `displayName` for forwardRef components

**Example Pattern**:
```typescript
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "default-size",
        sm: "small-size",
      },
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### State Management Strategy

**Centralized in page.tsx**:
- All business logic state lives in the page component
- UI state (sidebar open, panel open, etc.) also in page component
- Custom hooks for complex logic (map management, layer management)

**Component Pattern**:
- All components are **fully controlled** (no internal state)
- **Props down, events up** architecture
- Clear, unidirectional data flow

**Benefits**:
- Single source of truth
- Easier debugging and testing
- Clear data flow
- Better performance optimization

### Import Conventions

**Always use absolute imports with `@/` alias**:
```typescript
// ✅ Correct
import { Button } from "@/components/ui/button";
import { Map } from "@/components/map/Map";
import { useMap } from "@/hooks/useMap";
import { DEFAULT_MAP_CONFIG } from "@/lib/mapConfig";
import type { MapConfig } from "@/types/map";

// ❌ Incorrect
import { Button } from "../../components/ui/button";
```

**No barrel exports**:
- Import components directly from their files
- No `index.ts` re-export files

## Type System

### Core Types (`/types/map.ts`)

```typescript
// Layer configurations
interface GeoJSONLayerConfig {
  id: string;
  name: string;
  description?: string;
  sourceUrl: string;
  geometryType: "polygon" | "line" | "point" | "mixed";
  visible: boolean;
  style: LayerStyle;
  clustering?: ClusterConfig;
}

interface WMSLayerConfig {
  id: string;
  name: string;
  description?: string;
  baseUrl: string;
  layers: string;
  version?: string;
  format?: string;
  transparent?: boolean;
  visible: boolean;
  opacity?: number;
  attribution?: string;
  srs?: string;
}

type LayerConfig = GeoJSONLayerConfig | WMSLayerConfig;

// Type guards
function isWMSLayer(layer: LayerConfig): layer is WMSLayerConfig
function isGeoJSONLayer(layer: LayerConfig): layer is GeoJSONLayerConfig
```

## Styling Conventions

### Tailwind CSS

**Color Tokens** (semantic, theme-aware):
```typescript
// Use semantic tokens instead of direct colors
bg-card              // instead of bg-white
text-card-foreground // instead of text-black
border-border        // instead of border-gray-200
```

**Dark Mode**:
```typescript
// Automatic dark mode variants
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

**Transitions**:
```typescript
// Consistent transition classes
transition-all duration-300
transition-opacity duration-300
transition-[width] duration-500 ease-in-out
```

## Custom Hooks

### Hook Patterns

**File location**: `/hooks/`
**Naming**: `use{PascalCase}.ts`

**Example**:
```typescript
// /hooks/useMap.ts
export function useMap() {
  const mapRef = useRef<MapRef | null>(null);

  const toggleView = (is3D: boolean) => {
    // implementation
  };

  return { mapRef, toggleView };
}
```

## Page Architecture (app/page.tsx)

### Structure Overview

```typescript
function HomeContent() {
  // 1. Hooks
  const { mapRef, toggleView } = useMap();
  const searchParams = useSearchParams();

  // 2. State declarations
  const [mapStyle, setMapStyle] = useState(/* ... */);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // ... other state

  // 3. Effects
  useEffect(() => {
    // URL parameter parsing, etc.
  }, [searchParams]);

  // 4. Event handlers
  const handleViewToggle = () => { /* ... */ };
  const handleLayerToggle = (layerId: string) => { /* ... */ };
  // ... other handlers

  // 5. Render
  return (
    <div className="flex h-screen">
      {/* Component composition */}
      <ActiveLayersSidebar {...props} />
      <SidebarToggleButtons {...props} />
      <main>
        <MapControls {...props} />
        <LayerPanelToggle {...props} />
        <Map {...props} />
      </main>
    </div>
  );
}
```

### Key Features in page.tsx

1. **Active Layers Sidebar**: Collapsible sidebar showing active GeoJSON and WMS layers
2. **Sidebar Toggle Buttons**: Positioned outside sidebar for expand/collapse
3. **Map Controls**: Top-right controls (style switcher, 2D/3D toggle, terrain)
4. **Layer Panel**: Top-left panel for managing all available layers
5. **Main Map**: MapLibre GL map with dynamic layers

## Adding New Components

### When to create a new component

1. **Component has > 50 lines of JSX**
2. **Component is reused in multiple places**
3. **Component has a single, clear responsibility**
4. **Component improves code organization**

### Steps to add a new map component

1. **Create file** in `/components/map/{ComponentName}.tsx`
2. **Use PascalCase** for filename
3. **Add "use client" directive**
4. **Define props interface**: `interface {ComponentName}Props`
5. **Use fully controlled pattern** (no internal state)
6. **Import with absolute path**: `@/components/map/{ComponentName}`
7. **Export as named export**: `export function ComponentName() {}`

### Steps to add a new UI component

1. **Create file** in `/components/ui/{component-name}.tsx`
2. **Use kebab-case** for filename
3. **Follow shadcn/ui patterns** (forwardRef, cva, variants)
4. **Add "use client" directive**
5. **Export component and variants**: `export { Component, componentVariants }`

## Common Patterns

### Controlled Component Pattern

```typescript
// Parent (page.tsx)
const [isSidebarOpen, setIsSidebarOpen] = useState(true);

<ActiveLayersSidebar
  isOpen={isSidebarOpen}
  onToggle={setIsSidebarOpen}
  // ... other props
/>

// Child (ActiveLayersSidebar.tsx)
interface ActiveLayersSidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  // ... other props
}

export function ActiveLayersSidebar({ isOpen, onToggle }: ActiveLayersSidebarProps) {
  // No internal state - fully controlled by parent
  return (/* ... */);
}
```

### Conditional Rendering with Transitions

```typescript
<div
  className={`transition-opacity duration-300 ${
    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
>
  {/* Content */}
</div>
```

### Array Filtering Pattern

```typescript
// Filter in parent, pass filtered array to child
<ActiveLayersSidebar
  geojsonLayers={allLayers.filter(layer => layer.visible)}
  wmsLayers={wmsLayers.filter(layer => layer.visible)}
/>
```

## Development Workflow

### Build and Dev Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

### File Modification Guidelines

1. **Read before editing**: Always read existing files before making changes
2. **Follow existing patterns**: Match the style and structure of surrounding code
3. **Preserve functionality**: Don't change behavior unless explicitly requested
4. **No over-engineering**: Keep solutions simple and focused
5. **Use semantic colors**: Use theme tokens, not direct colors

## Key Configuration Files

- **tsconfig.json**: TypeScript configuration with `@/*` path alias
- **tailwind.config.ts**: Tailwind configuration with theme tokens
- **next.config.ts**: Next.js configuration
- **package.json**: Dependencies and scripts

## Design Principles

1. **Single Responsibility**: Each component does one thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props Down, Events Up**: Unidirectional data flow
4. **Type Safety**: Explicit TypeScript interfaces for all props
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Performance**: Controlled components, filtered arrays, memoization when needed
7. **Maintainability**: Clear naming, consistent patterns, comprehensive types

## Future Considerations

When extending the application:

1. **State Management**: If state becomes complex, consider Zustand or Jotai
2. **Testing**: Add unit tests for components and integration tests for user flows
3. **Performance**: Consider React.memo for expensive renders
4. **Code Splitting**: Use dynamic imports for large components
5. **Error Boundaries**: Add error boundaries for better error handling
6. **Logging**: Add structured logging for debugging
7. **Analytics**: Consider adding usage analytics

---

**Last Updated**: 2025-12-25
**Version**: 1.0.0
