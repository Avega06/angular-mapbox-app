import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { LngLat, LngLatLike, Map, Marker } from 'mapbox-gl';

import { environment } from '@env/environment.development';
import { MapStyle, StyleOptions } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private platformId = inject(PLATFORM_ID);
  public map = signal<Map | null>(null);

  public style = signal<MapStyle>({
    value: 'street',
    style: StyleOptions.STREET,
  });

  public currentUserPosition = signal<LngLatLike>([0, 0]);

  public currentLat = computed<LngLatLike>(
    () => new LngLat(-72.3537, -37.4693)
  );

  public markerElement = computed<HTMLDivElement>(() => {
    const markerElement = document.createElement('div');
    markerElement.className = 'location-container';
    markerElement.innerHTML = `
      <img class="location-circle" src="geolocation.svg"/>`;

    return markerElement;
  });

  public isPlatformBrowser = computed<boolean>(() =>
    isPlatformBrowser(this.platformId)
  );

  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable<GeolocationPosition>((observer) => {
      if (this.isPlatformBrowser()) {
        if (!navigator.geolocation) {
          observer.error('Geolocation is not supported by this browser.');
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              observer.next(position);
              observer.complete();
            },
            (error) => observer.error(error),
            {
              enableHighAccuracy: true,
              maximumAge: 0,
            }
          );
        }
      }
    });
  }

  initializeMap(mapRef: any, position: LngLatLike) {
    if (this.isPlatformBrowser()) {
      if (!mapRef) throw 'The Html element was not initialized';

      this.map!.set(
        new Map({
          accessToken: environment.MAPBOX_KEY,
          container: mapRef?.nativeElement,
          style: this.style().style,
          center: position,
          zoom: position ? 18 : 10,
        })
      );

      this.currentUserPosition.set(position);

      new Marker({
        color: 'red',
        element: this.markerElement(),
      })
        .setLngLat(position)
        .addTo(this.map()!);
    }
  }

  handleClickCurrentPosition() {
    if (this.isPlatformBrowser()) {
      this.map()?.flyTo({
        center: this.currentUserPosition(),
        zoom: 18,
      });
    }
  }

  onChangeMap(type?: string) {
    if (type === this.style().value) return;

    if (this.map) {
      this.map()?.remove();
    }

    switch (type) {
      case 'satellite':
        this.style.set({
          value: 'satellite',
          style: StyleOptions.SATELLITE,
        });
        break;
      case 'street':
        this.style.set({ value: 'street', style: StyleOptions.STREET });
        break;
      case 'dark':
        this.style.set({ value: 'dark', style: StyleOptions.DARK });
        break;
      case 'outdoors':
        this.style.set({ value: 'outdoors', style: StyleOptions.OUTDOORS });
        break;
      default:
        this.style.set({ value: 'street', style: StyleOptions.STREET });
        break;
    }
    this.map?.update((value) => value?.setStyle(this.style().style) ?? null);
  }
}
