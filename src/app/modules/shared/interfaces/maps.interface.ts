export enum StyleOptions {
  STREET = 'mapbox://styles/mapbox/streets-v12',
  DARK = 'mapbox://styles/mapbox/dark-v11',
  SATELLITE = 'mapbox://styles/mapbox/satellite-streets-v12',
  OUTDOORS = 'mapbox://styles/mapbox/outdoors-v12',
}

export interface MapStyle {
  value: string;
  style: StyleOptions;
}
