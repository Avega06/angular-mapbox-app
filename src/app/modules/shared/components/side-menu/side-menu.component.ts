import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: 'side-menu.component.html',
  styleUrl: './side-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  public menuItems = signal<MenuItem[]>([
    { name: 'FullScreen', route: '/maps/fullscreen' },
    { name: 'Zoom-Range', route: '/maps/zoom-range' },
    { name: 'Markers', route: '/maps/markers' },
    { name: 'Properties', route: '/maps/properties' },
  ]);
}
