import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import {
  detectFormat,
  parseGeoJSON,
  parseKML,
  parseShapefile,
  parseCSV,
  detectGeometryType,
} from "@/lib/layerParsers";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB" },
        { status: 400 }
      );
    }

    // Detect format
    const format = detectFormat(file.name, file.type);
    if (!format) {
      return NextResponse.json(
        { error: "Unsupported file format" },
        { status: 400 }
      );
    }

    // Parse file to GeoJSON
    let geojson: GeoJSON.FeatureCollection;

    try {
      switch (format) {
        case "geojson":
          geojson = await parseGeoJSON(file);
          break;
        case "kml":
        case "kmz":
          geojson = await parseKML(file);
          break;
        case "shapefile":
          geojson = await parseShapefile(file);
          break;
        case "csv":
          geojson = await parseCSV(file);
          break;
        default:
          throw new Error(`Format ${format} not yet implemented`);
      }
    } catch (parseError: any) {
      return NextResponse.json(
        { error: `Failed to parse file: ${parseError.message}` },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-z0-9.]/gi, "_").toLowerCase();
    const filename = `${timestamp}_${sanitizedName}.geojson`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Write GeoJSON to file
    await writeFile(filepath, JSON.stringify(geojson, null, 2));

    // Return public URL
    const publicUrl = `/uploads/${filename}`;

    // Detect geometry type
    const geometryType = detectGeometryType(geojson);

    return NextResponse.json({
      url: publicUrl,
      filename: file.name,
      format,
      featureCount: geojson.features.length,
      geometryType,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
