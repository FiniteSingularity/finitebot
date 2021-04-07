import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChalkboardOverlayRoutes } from './chalkboard-overlay-routing.module';
import { ChalkboardOverlayComponent } from './chalkboard-overlay.component';
import { ChalkboardCheerComponent } from './components/chalkboard-cheer/chalkboard-cheer.component';
import { ChalkboardPointTestComponent } from './components/chalkboard-point-test/chalkboard-point-test.component';
import { ChalkboardSubscribeComponent } from './components/chalkboard-subscribe/chalkboard-subscribe.component';
import { ChalkboardRaidComponent } from './components/chalkboard-raid/chalkboard-raid.component';

@NgModule({
  declarations: [
    ChalkboardOverlayComponent,
    ChalkboardCheerComponent,
    ChalkboardPointTestComponent,
    ChalkboardSubscribeComponent,
    ChalkboardRaidComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ChalkboardOverlayRoutes)
  ]
})
export class ChalkboardOverlayModule { }
