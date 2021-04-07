import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CirclesComponent } from '../circles/circles.component';
import { RouterModule } from '@angular/router';
import { CirclesRoutes } from './circles-routing.module';



@NgModule({
  declarations: [CirclesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(CirclesRoutes)
  ]
})
export class CirclesModule { }
