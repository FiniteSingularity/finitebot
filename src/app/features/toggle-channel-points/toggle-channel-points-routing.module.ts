import { Routes } from '@angular/router';
import { ToggleChannelPointsComponent } from './toggle-channel-points.component';

export const ToggleChannelPointsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ToggleChannelPointsComponent,
  },
];
