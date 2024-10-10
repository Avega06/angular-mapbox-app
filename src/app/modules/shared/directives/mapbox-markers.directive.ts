import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  inject,
  input,
  PLATFORM_ID,
  signal,
  effect,
} from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

export interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Directive({
  selector: '[appMapboxMarkers]',
  standalone: true,
})
export class MapboxMarkersDirective {
  public mapInstance = input<Map>();

  public markers = signal<MarkerAndColor[]>([]);
  public platformId = inject(PLATFORM_ID);

  mapEffect = effect(() => {
    if (isPlatformBrowser(this.platformId)) {
      if (this.mapInstance()) {
        this.mapInstance()!.on('load', () => {
          this.readFromLocalStorage();
        });

        this.mapInstance()!.on('click', (e) => {
          this.createMarker();
        });
      }
    }
  });

  createMarker(): void {
    if (!this.mapInstance()) return;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const lngLat = this.mapInstance()!.getCenter();

    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string): void {
    const marker = new Marker({ color, draggable: true })
      .setLngLat(lngLat)
      .addTo(this.mapInstance()!);

    if (!this.markers()) this.markers.set([]);

    this.markers.update((markers) => [...markers, { color, marker }]);
    // this.markers().push({ color, marker });

    this.saveToLocalStorage();

    marker.on('dragend', () => {
      this.saveToLocalStorage();
    });
  }

  deleteMarker(marker: Marker): void {
    marker.remove();
    this.markers.set(this.markers()?.filter((m) => m.marker !== marker));
  }

  flyTo(marker: Marker): void {
    this.mapInstance()?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
      essential: true, // this animation is considered essential for navigation purposes (on a real device)
    });
  }

  saveToLocalStorage(): void {
    const plainMarker: PlainMarker[] = this.markers()!.map(
      ({ color, marker }) => ({
        color,
        lngLat: marker.getLngLat().toArray(),
      })
    );

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarker));
  }

  readFromLocalStorage(): void {
    const plainMarkerString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkerString);

    plainMarkers.forEach(({ lngLat, color }) => {
      const [lng, lat] = lngLat;

      const coors = new LngLat(lng, lat);
      this.addMarker(coors, color);
    });
  }
}
