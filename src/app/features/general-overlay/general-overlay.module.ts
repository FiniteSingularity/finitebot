import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralOverlayComponent } from './general-overlay.component';
import { RouterModule } from '@angular/router';
import { GeneralOverlayRoutes } from './general-overlay-routing.module';
import { FollowComponent } from './components/follow/follow.component';



@NgModule({
  declarations: [
    GeneralOverlayComponent,
    FollowComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(GeneralOverlayRoutes)
  ]
})
export class GeneralOverlayModule { }
