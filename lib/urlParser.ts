import type { WMSLayerConfig } from "@/types/map";

export interface URLMapState {
  wmsLayers: WMSLayerConfig[];
  viewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

/**
 * Parse WMS layer from URL parameters
 * Expected format: wms=baseUrl|layers|name[|version|format|transparent|opacity]
 * Example: wms=http://localhost:8080/geoserver/wms|workspace:layername|My Layer|1.1.0|image/png|true|0.8
 */
export function parseWMSFromURL(searchParams: URLSearchParams): WMSLayerConfig[] {
  const wmsParams = searchParams.getAll('wms');
  const layers: WMSLayerConfig[] = [];

  wmsParams.forEach((param, index) => {
    const parts = param.split('|');

    if (parts.length < 3) {
      console.warn(`Invalid WMS parameter format: ${param}`);
      return;
    }

    const [baseUrl, layerNames, name, version, format, transparent, opacity, srs] = parts;

    layers.push({
      id: `wms-${index}-${Date.now()}`,
      name: decodeURIComponent(name),
      baseUrl: decodeURIComponent(baseUrl),
      layers: decodeURIComponent(layerNames),
      version: version ? decodeURIComponent(version) : '1.1.1',
      format: format ? decodeURIComponent(format) : 'image/png',
      transparent: transparent ? transparent === 'true' : true,
      visible: true,
      opacity: opacity ? parseFloat(opacity) : 1.0,
      srs: srs ? decodeURIComponent(srs) : 'EPSG:3857',
    });
  });

  return layers;
}

/**
 * Parse view state from URL parameters
 */
export function parseViewStateFromURL(searchParams: URLSearchParams) {
  const lon = searchParams.get('lon');
  const lat = searchParams.get('lat');
  const zoom = searchParams.get('zoom');

  if (lon && lat && zoom) {
    return {
      longitude: parseFloat(lon),
      latitude: parseFloat(lat),
      zoom: parseFloat(zoom),
    };
  }

  return null;
}

/**
 * Parse all map state from URL
 */
export function parseURLMapState(searchParams: URLSearchParams): URLMapState {
  return {
    wmsLayers: parseWMSFromURL(searchParams),
    viewState: parseViewStateFromURL(searchParams) || undefined,
  };
}

/**
 * Build WMS GetMap URL
 */
export function buildWMSUrl(config: WMSLayerConfig, bbox: string, width: number, height: number, srs: string = 'EPSG:3857'): string {
  const params = new URLSearchParams({
    SERVICE: 'WMS',
    VERSION: config.version || '1.1.1',
    REQUEST: 'GetMap',
    LAYERS: config.layers,
    BBOX: bbox,
    WIDTH: width.toString(),
    HEIGHT: height.toString(),
    FORMAT: config.format || 'image/png',
    TRANSPARENT: config.transparent ? 'TRUE' : 'FALSE',
    SRS: srs,
  });

  return `${config.baseUrl}?${params.toString()}`;
}
