import { load } from "@loaders.gl/core";
import { KMLLoader } from "@loaders.gl/kml";
import { ShapefileLoader } from "@loaders.gl/shapefile";
import Papa from "papaparse";

export type SupportedFormat =
  | "geojson"
  | "kml"
  | "kmz"
  | "shapefile"
  | "gpx"
  | "csv"
  | "topojson";

export function detectFormat(
  filename: string,
  mimeType?: string
): SupportedFormat | null {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "geojson" || ext === "json") return "geojson";
  if (ext === "kml") return "kml";
  if (ext === "kmz") return "kmz";
  if (ext === "zip") return "shapefile"; // Assume shapefile if .zip
  if (ext === "gpx") return "gpx";
  if (ext === "csv") return "csv";
  if (ext === "topojson") return "topojson";

  return null;
}

export async function parseGeoJSON(
  file: File
): Promise<GeoJSON.FeatureCollection> {
  const text = await file.text();
  const data = JSON.parse(text);

  // Validate GeoJSON structure
  if (!data.type) throw new Error("Invalid GeoJSON: missing type field");

  // If it's a single Feature, wrap in FeatureCollection
  if (data.type === "Feature") {
    return {
      type: "FeatureCollection",
      features: [data],
    };
  }

  // If it's a FeatureCollection, return as-is
  if (data.type === "FeatureCollection") {
    return data;
  }

  // If it's a Geometry, wrap in Feature and FeatureCollection
  if (
    [
      "Point",
      "LineString",
      "Polygon",
      "MultiPoint",
      "MultiLineString",
      "MultiPolygon",
    ].includes(data.type)
  ) {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: data,
          properties: {},
        },
      ],
    };
  }

  throw new Error("Invalid GeoJSON structure");
}

export async function parseKML(
  file: File
): Promise<GeoJSON.FeatureCollection> {
  const arrayBuffer = await file.arrayBuffer();
  const geojson = await load(arrayBuffer, KMLLoader);
  return geojson as GeoJSON.FeatureCollection;
}

export async function parseShapefile(
  file: File
): Promise<GeoJSON.FeatureCollection> {
  const arrayBuffer = await file.arrayBuffer();
  const geojson = await load(arrayBuffer, ShapefileLoader);
  return geojson as GeoJSON.FeatureCollection;
}

export async function parseCSV(
  file: File
): Promise<GeoJSON.FeatureCollection> {
  const text = await file.text();

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      complete: (results) => {
        try {
          // Auto-detect lat/lon column names
          const headers = Object.keys(results.data[0] || {});
          const latCol = headers.find((h) => /^(lat|latitude|y)$/i.test(h));
          const lonCol = headers.find((h) => /^(lon|lng|longitude|x)$/i.test(h));

          if (!latCol || !lonCol) {
            throw new Error(
              "Could not detect latitude/longitude columns in CSV"
            );
          }

          const features = results.data
            .filter((row: any) => row[latCol] && row[lonCol])
            .map((row: any) => ({
              type: "Feature" as const,
              geometry: {
                type: "Point" as const,
                coordinates: [parseFloat(row[lonCol]), parseFloat(row[latCol])],
              },
              properties: row,
            }));

          resolve({
            type: "FeatureCollection",
            features,
          });
        } catch (error) {
          reject(error);
        }
      },
      error: (error: Error) => reject(error),
    });
  });
}

export function detectGeometryType(
  geojson: GeoJSON.FeatureCollection
): "point" | "line" | "polygon" {
  if (!geojson.features || geojson.features.length === 0) {
    return "point"; // Default fallback
  }

  const firstGeom = geojson.features[0].geometry;
  if (!firstGeom) return "point";

  const type = firstGeom.type;

  if (type === "Point" || type === "MultiPoint") return "point";
  if (type === "LineString" || type === "MultiLineString") return "line";
  if (type === "Polygon" || type === "MultiPolygon") return "polygon";

  return "point";
}

export function getFeatureCount(geojson: GeoJSON.FeatureCollection): number {
  return geojson.features?.length || 0;
}
