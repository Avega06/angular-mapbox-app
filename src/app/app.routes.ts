import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'maps',
    loadComponent: () =>
      import('./modules/maps/layouts/maps-layout/maps-layout.component'),
    children: [
      {
        path: 'fullscreen',
        loadComponent: () =>
          import('./modules/maps/pages/fullscreen/fullscreen.component'),
      },
      {
        path: 'markers',
        loadComponent: () =>
          import('./modules/maps/pages/markers/markers.component'),
      },
      {
        path: 'zoom-range',
        loadComponent: () =>
          import('./modules/maps/pages/zoom-range/zoom-range.component'),
      },
      //   { path: 'zoom-range', component: ZoomRangePageComponent },
      //   { path: 'properties', component: PropertiesPageComponent },
      //   { path: '**', redirectTo: 'fullscreen' },
    ],
  },
  {
    path: '**',
    redirectTo: 'maps/fullscreen',
    pathMatch: 'full',
  },
];
