import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CirclesBinningRoutes } from './circles-binning-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(CirclesBinningRoutes)
  ]
})
export class CirclesBinningModule { }
