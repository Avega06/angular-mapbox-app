import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { LngLat, LngLatLike, Map } from 'mapbox-gl';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRoad, faSatellite } from '@fortawesome/free-solid-svg-icons';
import { environment } from '@env/environment.development';
import { StyleOptions } from '../../interfaces';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  MapboxMarkersDirective,
  MarkerAndColor,
} from '../../directives/mapbox-markers.directive';
import { ZoomRangeDirective } from '../../directives/zoom-range.directive';
import { MapboxService } from '../../services/mapbox.service';

@Component({
  selector: 'shared-map',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnDestroy {
  public mapRef = viewChild<ElementRef>('mapsRef');
  public mapboxService = inject(MapboxService);
  public markerDirective = inject(MapboxMarkersDirective, {
    host: true,
    optional: true,
  });

  public zoomRangeDirective = inject(ZoomRangeDirective, {
    host: true,
    optional: true,
  });

  public mapsInstance = output<Map>();
  public map = signal<Map | null>(null);

  public markers = computed<MarkerAndColor[] | null>(() => {
    return this.markerDirective!.markers();
  });

  public isMarkerDirectiveActive = computed<boolean>(() =>
    this.markerDirective ? true : false
  );

  public isZoomRangeDirectiveActive = computed<boolean>(() =>
    this.zoomRangeDirective ? true : false
  );

  public currentLat = computed<LngLatLike>(() =>
    this.mapboxService.currentLat()
  );

  public mapIcons = computed<Record<string, IconDefinition>>(() => ({
    road: faRoad,
    satelite: faSatellite,
  }));

  public mapEffect = effect(
    () => {
      this.mapboxService.initializeMap(this.mapRef());
      this.map.set(this.mapboxService.map());
      this.mapsInstance.emit(this.map()!);
    },
    { allowSignalWrites: true }
  );

  ngOnDestroy(): void {
    this.map()?.remove;
  }

  public onChangeMap(type?: string) {
    this.mapboxService.onChangeMap(type);
  }
}
