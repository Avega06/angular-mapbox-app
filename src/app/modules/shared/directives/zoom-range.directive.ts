import { AfterViewInit, Directive, effect, input, signal } from '@angular/core';

import { LngLat, Map, Marker } from 'mapbox-gl';

@Directive({
  selector: '[appZoomRange]',
  standalone: true,
})
export class ZoomRangeDirective {
  public mapInstance = input<Map>();

  public zoom = signal<number>(10);
  public currentLngLat = signal<LngLat | null>(null);

  public zoomRangeEffect = effect(() => {
    if (this.mapInstance()) {
      this.mapListeners();
    }
  });

  mapListeners() {
    if (!this.mapInstance()) throw 'Map not initialized';

    this.mapInstance()!.on('zoom', (ev) => {
      this.zoom.set(this.mapInstance()!.getZoom());
    });

    this.mapInstance()!.on('zoomend', () => {
      if (this.mapInstance()!.getZoom() < 18) return;
      this.mapInstance()!.zoomTo(18);
    });

    this.mapInstance()!.on('moveend', () => {
      this.currentLngLat.set(this.mapInstance()!.getCenter());
    });
  }

  zoomIn() {
    this.mapInstance()?.zoomIn();
  }

  zoomOut() {
    this.mapInstance()?.zoomOut();
  }

  zoomChanged(value: string) {
    this.mapInstance()?.zoomTo(+value);
  }
}
