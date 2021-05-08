import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CirclesBinningComponent } from './features/circles-binning/circles-binning.component';
import { BehindYouComponent } from './features/chalkboard-overaly/components/behind-you/behind-you.component';

@NgModule({
  declarations: [
    AppComponent,
    CirclesBinningComponent,
    BehindYouComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
