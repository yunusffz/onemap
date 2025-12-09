# MapLibre Boilerplate

A modern, scalable Next.js boilerplate featuring Tailwind CSS, TanStack Query, and MapLibre GL for building interactive map applications.

## Features

- **Next.js 15** with App Router and React Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling with dark mode support
- **TanStack Query** (React Query) for efficient data fetching and caching
- **MapLibre GL** for high-performance, customizable maps
- **ESLint** for code linting
- Scalable folder structure following best practices
- Custom hooks for map interactions
- Reusable map components (Map, Marker, Popup)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yunusffz/maplibre-boilerplate.git
cd maplibre-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page with map example
│   ├── providers.tsx        # TanStack Query provider
│   └── globals.css          # Global styles with Tailwind
├── components/              # Reusable components
│   ├── map/                 # Map-related components
│   │   ├── Map.tsx         # Main map component
│   │   ├── MapMarker.tsx   # Marker component
│   │   └── MapPopup.tsx    # Popup component
│   └── ui/                  # UI components (future)
├── hooks/                   # Custom React hooks
│   └── useMap.ts           # Map interaction hook
├── lib/                     # Utility functions and configs
│   ├── queryClient.ts      # TanStack Query configuration
│   └── mapConfig.ts        # Map default configurations
├── types/                   # TypeScript type definitions
│   └── map.ts              # Map-related types
└── public/                  # Static assets
```

## Usage Examples

### Basic Map

```tsx
import { Map } from "@/components/map/Map";
import { useMap } from "@/hooks/useMap";

export default function MapPage() {
  const { mapRef } = useMap();

  return (
    <Map
      mapRef={mapRef}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 12,
      }}
    />
  );
}
```

### Map with Markers

```tsx
import { Map } from "@/components/map/Map";
import { MapMarker } from "@/components/map/MapMarker";

export default function MarkersPage() {
  return (
    <Map>
      <MapMarker
        longitude={-122.4}
        latitude={37.8}
        onClick={() => console.log("Marker clicked")}
      />
    </Map>
  );
}
```

### Using TanStack Query

```tsx
import { useQuery } from "@tanstack/react-query";

function Locations() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await fetch("/api/locations");
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading locations</div>;

  return <div>{/* Render locations */}</div>;
}
```

### Map Hook Utilities

```tsx
import { useMap } from "@/hooks/useMap";

function MapControls() {
  const { mapRef, flyTo, fitBounds } = useMap();

  const handleFlyTo = () => {
    flyTo({ longitude: -122.4, latitude: 37.8, zoom: 14 });
  };

  const handleFitBounds = () => {
    fitBounds([
      [-122.5, 37.7],
      [-122.3, 37.9],
    ]);
  };

  return (
    <>
      <button onClick={handleFlyTo}>Fly to location</button>
      <button onClick={handleFitBounds}>Fit bounds</button>
    </>
  );
}
```

## Configuration

### Map Styles

The boilerplate includes several free map styles in `lib/mapConfig.ts`:

- **POSITRON**: Light base map (default)
- **DARK_MATTER**: Dark base map
- **VOYAGER**: Detailed base map
- **OSM_BRIGHT**: OpenStreetMap bright style
- **OSM_LIBERTY**: OpenStreetMap liberty style

Change the map style:

```tsx
import { MAP_STYLES } from "@/lib/mapConfig";

<Map mapStyle={MAP_STYLES.DARK_MATTER} />
```

### TanStack Query Configuration

Configure query defaults in `lib/queryClient.ts`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      gcTime: 5 * 60 * 1000,       // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Best Practices Implemented

1. **Component Organization**: Separation of concerns with dedicated folders
2. **Type Safety**: Full TypeScript coverage with custom types
3. **Reusability**: Generic, composable components
4. **Performance**: React Query caching and Next.js optimizations
5. **Scalability**: Clear folder structure for growing applications
6. **Developer Experience**: ESLint, TypeScript, and clear documentation

## Contributing

Feel free to submit issues and enhancement requests.

## License

ISC
