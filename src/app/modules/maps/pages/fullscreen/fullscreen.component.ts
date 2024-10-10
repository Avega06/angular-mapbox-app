import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MapComponent } from '../../../shared/components/map/map.component';

@Component({
  selector: 'app-fullscreen',
  standalone: true,
  imports: [CommonModule, MapComponent],
  templateUrl: './fullscreen.component.html',
  styleUrl: './fullscreen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FullscreenComponent {}
