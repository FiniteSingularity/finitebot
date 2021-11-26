import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'chalkboard-overlay',
    loadChildren: () =>
      import('./features/chalkboard-overlay/chalkboard-overlay.module').then(
        (mod) => mod.ChalkboardOverlayModule
      ),
  },
  {
    path: 'general-overlay',
    loadChildren: () =>
      import('./features/general-overlay/general-overlay.module').then(
        (mod) => mod.GeneralOverlayModule
      ),
  },
  {
    path: 'chalk-boom-overlay',
    loadChildren: () =>
      import('./features/chalk-boom-overlay/chalk-boom-overlay.module').then(
        (mod) => mod.ChalkBoomOverlayModule
      ),
  },
  {
    path: 'toggle-channel-points',
    loadChildren: () =>
      import(
        './features/toggle-channel-points/toggle-channel-points.module'
      ).then((mod) => mod.ToggleChannelPointsModule),
  },
  {
    path: 'circles',
    loadChildren: () =>
      import('./features/circles/circles.module').then(
        (mod) => mod.CirclesModule
      ),
  },
  {
    path: 'circles-binning',
    loadChildren: () =>
      import('./features/circles-binning/circles-binning.module').then(
        (mod) => mod.CirclesBinningModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
