/**
 * Icon Usage Examples
 * This file demonstrates various ways to use icons in the project
 * Delete this file after reviewing or keep it as reference
 */

import { ChevronLeft, Map, Layers, Settings, Search } from "@/components/icons";
import { Logo } from "@/components/icons/custom/Logo";

export function IconExamples() {
  return (
    <div className="space-y-8 p-8">
      {/* Example 1: Icon in Button */}
      <section>
        <h3 className="text-lg font-semibold mb-4">1. Icons in Buttons</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            className="p-2 bg-gray-200 rounded"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Example 2: Icon Sizes */}
      <section>
        <h3 className="text-lg font-semibold mb-4">2. Icon Sizes</h3>
        <div className="flex items-center gap-4">
          <Map className="w-3 h-3" /> {/* 12px */}
          <Map className="w-4 h-4" /> {/* 16px */}
          <Map className="w-5 h-5" /> {/* 20px */}
          <Map className="w-6 h-6" /> {/* 24px */}
          <Map className="w-8 h-8" /> {/* 32px */}
        </div>
      </section>

      {/* Example 3: Icon with Text Color */}
      <section>
        <h3 className="text-lg font-semibold mb-4">3. Colored Icons</h3>
        <div className="flex items-center gap-4">
          <Layers className="w-6 h-6 text-blue-600" />
          <Layers className="w-6 h-6 text-green-600" />
          <Layers className="w-6 h-6 text-red-600" />
        </div>
      </section>

      {/* Example 4: Custom Icon */}
      <section>
        <h3 className="text-lg font-semibold mb-4">4. Custom Icon</h3>
        <Logo className="w-12 h-12 text-blue-600" />
      </section>

      {/* Example 5: Icon in Input */}
      <section>
        <h3 className="text-lg font-semibold mb-4">5. Icon in Input</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded"
          />
        </div>
      </section>

      {/* Example 6: Icon with Hover States */}
      <section>
        <h3 className="text-lg font-semibold mb-4">6. Interactive Icons</h3>
        <button className="group p-2 rounded hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:rotate-90 transition-all duration-300" />
        </button>
      </section>

      {/* Example 7: Icon Accessibility */}
      <section>
        <h3 className="text-lg font-semibold mb-4">7. Accessibility</h3>
        <div className="flex gap-4">
          {/* Decorative icon (has visible text) */}
          <button className="flex items-center gap-2 px-4 py-2 border rounded">
            <Map className="w-4 h-4" aria-hidden="true" />
            View Map
          </button>

          {/* Functional icon (no visible text) */}
          <button
            className="p-2 border rounded"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
