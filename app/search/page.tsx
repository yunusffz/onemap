"use client";

import { useRouter } from "next/navigation";
import { LayerSearchView } from "@/components/map/LayerSearchView";
import type { LayerDetail } from "@/types/map";

export default function SearchPage() {
  const router = useRouter();

  const handleAddLayerToMap = (layer: LayerDetail) => {
    // Navigate back to main page with layer info in URL
    // You can customize this based on your URL structure
    router.push(`/?layer=${layer.id}`);
  };

  return (
    <LayerSearchView
      onAddLayerToMap={handleAddLayerToMap}
    />
  );
}
