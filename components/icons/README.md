# Icon Management Best Practices

## Overview
This guide outlines best practices for managing icons in your React/Next.js project.

## Recommended Approach: Icon Libraries

### 1. Use Lucide React (Primary - Already Installed)
```tsx
import { ChevronLeft, ChevronRight, Map, Layers } from "lucide-react";

export function MyComponent() {
  return (
    <button>
      <ChevronLeft className="w-4 h-4" />
      Click me
    </button>
  );
}
```

**Benefits:**
- Tree-shakeable (only import what you need)
- Consistent design language
- TypeScript support
- Customizable via props (size, color, strokeWidth)
- 1000+ icons available
- Actively maintained

### 2. Alternative Icon Libraries
- **Heroicons**: Clean, modern icons from Tailwind team
- **React Icons**: Aggregates multiple icon sets
- **Radix Icons**: Minimal, clean icons from Radix UI team

## Project Structure

```
components/
├── icons/
│   ├── README.md           # This file
│   ├── index.ts            # Re-export commonly used icons
│   └── custom/             # Custom SVG icons
│       ├── index.ts
│       └── Logo.tsx
```

## Best Practices

### 1. Centralize Icon Imports
Create a barrel export file to simplify imports across your app:

```tsx
// components/icons/index.ts
export {
  ChevronLeft,
  ChevronRight,
  Map,
  Layers,
  Settings,
  User,
  Menu,
  X as Close,
} from "lucide-react";

// Custom icons
export { Logo } from "./custom/Logo";
```

**Usage:**
```tsx
// Before
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/icons/custom/Logo";

// After
import { ChevronLeft, Logo } from "@/components/icons";
```

### 2. Create Custom Icon Wrapper (Optional)
For additional consistency or defaults:

```tsx
// components/icons/Icon.tsx
import { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

interface IconProps extends ComponentPropsWithoutRef<"svg"> {
  icon: LucideIcon;
  size?: number;
}

export function Icon({ icon: IconComponent, size = 16, className, ...props }: IconProps) {
  return (
    <IconComponent
      className={className}
      size={size}
      {...props}
    />
  );
}

// Usage
<Icon icon={ChevronLeft} size={20} className="text-blue-500" />
```

### 3. Custom SVG Icons
When you need custom icons not available in libraries:

```tsx
// components/icons/custom/Logo.tsx
import { SVGProps } from "react";

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2L2 7l10 5 10-5-10-5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2 17l10 5 10-5M2 12l10 5 10-5"
      />
    </svg>
  );
}
```

**Key Points:**
- Accept `className` for Tailwind styling
- Use `currentColor` for `stroke/fill` to inherit text color
- Spread remaining props for flexibility
- Keep viewBox consistent (usually "0 0 24 24")

### 4. Size Standards
Maintain consistent icon sizes:

```tsx
// Tailwind classes
"w-3 h-3"   // 12px - Very small (badges)
"w-4 h-4"   // 16px - Small (buttons, inline)
"w-5 h-5"   // 20px - Medium (nav items)
"w-6 h-6"   // 24px - Large (headers)
"w-8 h-8"   // 32px - Extra large (feature icons)
```

### 5. Accessibility
Always include proper accessibility attributes:

```tsx
// Decorative icons (with text)
<button>
  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
  Back
</button>

// Icon-only buttons
<button aria-label="Close sidebar">
  <X className="w-4 h-4" />
</button>
```

### 6. Performance Optimization
- **Tree-shaking**: Only import needed icons
- **Code splitting**: Load icon-heavy components lazily
- **SVG optimization**: Use SVGO for custom SVGs

```bash
# Optimize custom SVGs
npx svgo custom-icon.svg
```

## Anti-Patterns to Avoid

### ❌ Inline SVG everywhere
```tsx
// Bad - repetitive, hard to maintain
<svg className="w-4 h-4" fill="none" stroke="currentColor">
  <path d="M15 19l-7-7 7-7"/>
</svg>
```

### ❌ Hardcoded sizes
```tsx
// Bad - not flexible
<ChevronLeft width={16} height={16} />

// Good - use className
<ChevronLeft className="w-4 h-4" />
```

### ❌ Mixing icon libraries
```tsx
// Bad - inconsistent design language
import { ChevronLeft } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
```

### ❌ No centralization
```tsx
// Bad - scattered imports
import { Menu } from "lucide-react";  // in 10 different files
```

## Migration Guide

### Replacing Inline SVGs
1. Find similar icon in lucide-react: https://lucide.dev/icons
2. Replace SVG with component
3. Adjust size using className

```tsx
// Before
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
</svg>

// After
import { ChevronLeft } from "lucide-react";
<ChevronLeft className="w-4 h-4" />
```

## Resources
- [Lucide Icons](https://lucide.dev)
- [Heroicons](https://heroicons.com)
- [React Icons](https://react-icons.github.io/react-icons)
- [SVGO](https://github.com/svg/svgo)
