import type { WMSLayerConfig, GeoJSONLayerConfig } from "@/types/map";

export type URLServiceType =
  | { type: 'geojson'; url: string }
  | { type: 'wms'; config: Omit<WMSLayerConfig, 'id' | 'visible'> }
  | { type: 'arcgis'; url: string; layerId?: string }
  | { type: 'unknown' };

/**
 * Detect the type of map service from a URL
 */
export function detectURLServiceType(url: string): URLServiceType {
  const lowerUrl = url.toLowerCase();

  // GeoJSON file detection
  if (lowerUrl.endsWith('.geojson') || lowerUrl.endsWith('.json') || lowerUrl.includes('geojson')) {
    return { type: 'geojson', url };
  }

  // WMS service detection (GeoServer, MapServer, QGIS Server, etc.)
  if (lowerUrl.includes('/wms') || lowerUrl.includes('service=wms') || lowerUrl.includes('request=getcapabilities')) {
    return { type: 'wms', config: parseWMSUrl(url) };
  }

  // ArcGIS REST API detection
  if (lowerUrl.includes('/arcgis/rest/services') || lowerUrl.includes('/mapserver') || lowerUrl.includes('/featureserver')) {
    const layerIdMatch = url.match(/\/(\d+)\/?$/);
    return {
      type: 'arcgis',
      url: url.replace(/\/\d+\/?$/, ''),
      layerId: layerIdMatch ? layerIdMatch[1] : undefined
    };
  }

  return { type: 'unknown' };
}

/**
 * Parse WMS URL and extract configuration
 */
function parseWMSUrl(url: string): Omit<WMSLayerConfig, 'id' | 'visible'> {
  try {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;

    // Extract base URL (without query params)
    let baseUrl = `${urlObj.origin}${urlObj.pathname}`;

    // Remove trailing parameters-like paths
    if (baseUrl.includes('?')) {
      baseUrl = baseUrl.split('?')[0];
    }

    // Get layer names from URL params or path
    let layers = params.get('layers') || params.get('LAYERS') || '';

    // If no layers in params, try to extract from path (GeoServer style)
    if (!layers && baseUrl.includes('/')) {
      const pathParts = baseUrl.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart !== 'wms' && lastPart !== 'WMS') {
        layers = lastPart;
        // Remove layer from base URL
        baseUrl = pathParts.slice(0, -1).join('/');
      }
    }

    const version = params.get('version') || params.get('VERSION') || '1.1.1';
    let format = params.get('format') || params.get('FORMAT') || 'image/png';

    // Validate format - must be an image format
    const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validFormats.includes(format.toLowerCase())) {
      format = 'image/png';
    }

    const transparent = (params.get('transparent') || params.get('TRANSPARENT') || 'true').toLowerCase() === 'true';

    // Extract SRS/CRS (coordinate reference system)
    let srs = params.get('srs') || params.get('SRS') || params.get('crs') || params.get('CRS') || 'EPSG:3857';

    // Normalize SRS format
    if (!srs.toUpperCase().startsWith('EPSG:')) {
      srs = 'EPSG:3857'; // Default to Web Mercator
    }

    // Generate a descriptive name
    const name = layers || 'WMS Layer';

    return {
      name,
      baseUrl,
      layers,
      version,
      format,
      transparent,
      opacity: 1.0,
      srs,
    };
  } catch (error) {
    // If URL parsing fails, return basic config
    return {
      name: 'WMS Layer',
      baseUrl: url.split('?')[0],
      layers: '',
      version: '1.1.1',
      format: 'image/png',
      transparent: true,
      opacity: 1.0,
      srs: 'EPSG:3857',
    };
  }
}

/**
 * Fetch ArcGIS service metadata
 */
export async function fetchArcGISMetadata(url: string): Promise<{
  name: string;
  description?: string;
  extent?: any;
  layers?: any[];
}> {
  try {
    const metadataUrl = `${url}?f=json`;
    const response = await fetch(metadataUrl);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch ArcGIS service metadata');
  }
}

/**
 * Parse GetCapabilities XML for WMS (optional enhancement)
 */
export async function fetchWMSCapabilities(baseUrl: string): Promise<{
  layers: Array<{ name: string; title: string; abstract?: string }>;
  version: string;
}> {
  try {
    const capabilitiesUrl = `${baseUrl}?SERVICE=WMS&REQUEST=GetCapabilities`;
    const response = await fetch(capabilitiesUrl);
    if (!response.ok) throw new Error('Failed to fetch capabilities');

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');

    // Parse WMS version
    const version = xml.querySelector('WMS_Capabilities, WMT_MS_Capabilities')?.getAttribute('version') || '1.1.1';

    // Parse layers
    const layerElements = xml.querySelectorAll('Layer > Layer');
    const layers = Array.from(layerElements).map(layer => ({
      name: layer.querySelector('Name')?.textContent || '',
      title: layer.querySelector('Title')?.textContent || '',
      abstract: layer.querySelector('Abstract')?.textContent || undefined,
    }));

    return { layers, version };
  } catch (error) {
    throw new Error('Failed to parse WMS capabilities');
  }
}
