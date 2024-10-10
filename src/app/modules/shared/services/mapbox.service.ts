import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  ElementRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
  Signal,
} from '@angular/core';

import { LngLat, LngLatLike, Map } from 'mapbox-gl';

import { environment } from '@env/environment.development';
import { StyleOptions } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private platformId = inject(PLATFORM_ID);
  public map = signal<Map | null>(null);
  public style = signal<StyleOptions>(StyleOptions.STREET);
  public currentLat = computed<LngLatLike>(
    () => new LngLat(-72.3537, -37.4693)
  );

  initializeMap(mapRef: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (!mapRef) throw 'The Html element was not initialized';

      this.map!.set(
        new Map({
          accessToken: environment.MAPBOX_KEY,
          container: mapRef?.nativeElement,
          style: this.style(),
          center: this.currentLat(),
          zoom: 10,
        })
      );
    }
  }

  onChangeMap(type?: string) {
    switch (type) {
      case 'sat':
        this.style.set(StyleOptions.SATELLITE);
        break;
      default:
        this.style.set(StyleOptions.STREET);
        break;
    }
    this.map?.update((value) => value?.setStyle(this.style()) ?? null);
  }
}
