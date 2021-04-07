import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChalkBoomOverlayComponent } from './chalk-boom-overlay.component';
import { RouterModule } from '@angular/router';
import { ChalkBoomOverlayRoutes } from './chalk-boom-overlay-routing.module';
import { BoomComponent } from './components/boom/boom.component';
import { TimerComponent } from './components/timer/timer.component';
import { RocketComponent } from './components/rocket/rocket.component';
import { ScoreComponent } from './components/score/score.component';

@NgModule({
  declarations: [
    ChalkBoomOverlayComponent,
    BoomComponent,
    TimerComponent,
    RocketComponent,
    ScoreComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ChalkBoomOverlayRoutes)
  ]
})
export class ChalkBoomOverlayModule { }
