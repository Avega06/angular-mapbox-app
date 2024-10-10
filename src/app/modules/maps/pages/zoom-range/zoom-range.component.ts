import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { MapComponent } from 'src/app/modules/shared/components/map/map.component';
import { Map } from 'mapbox-gl';
import { ZoomRangeDirective } from 'src/app/modules/shared/directives/zoom-range.directive';
import { MapboxMarkersDirective } from 'src/app/modules/shared/directives/mapbox-markers.directive';

@Component({
  selector: 'app-zoom-range',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    ZoomRangeDirective,
    MapboxMarkersDirective,
  ],
  templateUrl: './zoom-range.component.html',
  styleUrl: './zoom-range.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ZoomRangeComponent implements OnDestroy {
  public maps = signal<Map | null>(null);

  onMapInstance(map: Map) {
    this.maps.set(map);
  }
  ngOnDestroy(): void {
    this.maps()?.remove();
  }
}
