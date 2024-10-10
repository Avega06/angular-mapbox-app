import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { Map } from 'mapbox-gl';
import { MapComponent } from 'src/app/modules/shared/components/map/map.component';
import { MapboxMarkersDirective } from 'src/app/modules/shared/directives/mapbox-markers.directive';

@Component({
  selector: 'app-markers',
  standalone: true,
  imports: [CommonModule, MapComponent, MapboxMarkersDirective],
  templateUrl: './markers.component.html',
  styleUrl: './markers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MarkersComponent implements OnDestroy {
  public maps = signal<Map | null>(null);

  onMapInstance(map: Map) {
    this.maps.set(map);
  }

  ngOnDestroy(): void {
    this.maps()?.remove();
  }
}
