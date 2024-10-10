import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../../shared/components/side-menu/side-menu.component';

@Component({
  selector: 'app-maps-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideMenuComponent],
  templateUrl: './maps-layout.component.html',
  styleUrl: './maps-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MapsLayoutComponent {}
