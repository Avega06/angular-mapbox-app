import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { LngLat, LngLatLike, Map } from 'mapbox-gl';

import {
  MapboxMarkersDirective,
  MarkerAndColor,
} from '../../directives/mapbox-markers.directive';
import { ZoomRangeDirective } from '../../directives/zoom-range.directive';
import { MapboxService } from '../../services/mapbox.service';
import { SelectMapBarComponent } from '../selectMapBar/selectMapBar.component';
import { After } from 'v8';

@Component({
  selector: 'shared-map',
  standalone: true,
  imports: [CommonModule, SelectMapBarComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  public mapsInstance = output<Map>();
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

  public map = signal<Map | null>(null);
  public isMapsSelected = signal(false);

  public userPosition = toSignal(this.mapboxService.getCurrentPosition());

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

  constructor() {
    effect(
      () => {
        this.mapboxService.initializeMap(this.mapRef(), this.getPosition());
        this.map.set(this.mapboxService.map());
        this.mapsInstance.emit(this.map()!);
      },
      { allowSignalWrites: true }
    );
  }
  ngAfterViewInit(): void {
    if (this.mapRef()) {
    }
  }

  getPosition(): LngLatLike {
    const position = this.userPosition();
    if (!position) return this.currentLat();

    return new LngLat(position.coords.longitude, position.coords.latitude);
  }

  flyToPosition() {
    this.mapboxService.handleClickCurrentPosition();
  }

  ngOnDestroy(): void {
    this.map()?.remove();
  }

  public onChangeMap(type?: string) {
    this.mapboxService.onChangeMap(type);
  }

  public toggleSelectMapMenu() {
    this.isMapsSelected.set(!this.isMapsSelected());
  }

  public getIconClass() {
    return this.isMapsSelected() ? 'fa-xmark' : 'fa-bars';
  }
}
