import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faRoad, faSatellite } from '@fortawesome/free-solid-svg-icons';

interface MapsOptions {
  value: string;
  icon: string;
}

@Component({
  selector: 'select-map-bar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './selectMapBar.component.html',
  styleUrl: './selectMapBar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMapBarComponent {
  public changeMap = output<string>();

  public selectedMap = signal<string | null>('street');

  public mapTypes = signal<MapsOptions[]>([
    {
      value: 'street',
      icon: 'fa-solid fa-road',
    },
    {
      value: 'satellite',
      icon: 'fa-solid fa-earth-americas',
    },
    {
      value: 'dark',
      icon: 'fa-solid fa-moon',
    },
    {
      value: 'outdoors',
      icon: 'fa-solid fa-tree',
    },
  ]);

  onChangeMap(value: string) {
    this.selectedMap.set(value);
    this.changeMap.emit(value);
  }
}
