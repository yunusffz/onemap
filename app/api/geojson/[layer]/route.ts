import { NextRequest, NextResponse } from "next/server";

const GEOJSON_SOURCES: Record<string, string> = {
  "sf-parks": "https://data.sfgov.org/resource/gtr9-ntp6.geojson?$limit=100",
  "sf-bike-lanes":
    "https://data.sfgov.org/resource/ygbp-mh9w.geojson?$limit=200",
  "sf-transit": "https://data.sfgov.org/resource/8jj7-66is.geojson?$limit=150",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ layer: string }> }
) {
  const { layer } = await params;
  const sourceUrl = GEOJSON_SOURCES[layer];

  if (!sourceUrl) {
    return NextResponse.json({ error: "Layer not found" }, { status: 404 });
  }

  try {
    const response = await fetch(sourceUrl, {
      headers: { Accept: "application/geo+json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GeoJSON data" },
      { status: 500 }
    );
  }
}
