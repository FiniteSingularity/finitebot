import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToggleChannelPointsComponent } from './toggle-channel-points.component';
import { ToggleChannelPointsRoutes } from './toggle-channel-points-routing.module';

@NgModule({
  declarations: [ToggleChannelPointsComponent],
  imports: [CommonModule, RouterModule.forChild(ToggleChannelPointsRoutes)],
})
export class ToggleChannelPointsModule {}
