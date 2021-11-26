import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChalkboardOverlayRoutes } from './chalkboard-overlay-routing.module';
import { ChalkboardOverlayComponent } from './chalkboard-overlay.component';
import { ChalkboardCheerComponent } from './components/chalkboard-cheer/chalkboard-cheer.component';
import { ChalkboardPointTestComponent } from './components/chalkboard-point-test/chalkboard-point-test.component';
import { ChalkboardSubscribeComponent } from './components/chalkboard-subscribe/chalkboard-subscribe.component';
import { ChalkboardRaidComponent } from './components/chalkboard-raid/chalkboard-raid.component';
import { BringFiniteWaterComponent } from './components/bring-finite-water/bring-finite-water.component';
import { BehindYouComponent } from './components/behind-you/behind-you.component';
import { MessageMatrixComponent } from './components/message-matrix/message-matrix.component';
import { ChalkboardGiftSubComponent } from './components/chalkboard-gift-sub/chalkboard-gift-sub.component';
import { ChalkboardSubNoMessageComponent } from './components/chalkboard-sub-no-message/chalkboard-sub-no-message.component';
import { CaptJackReviewComponent } from './components/capt-jack-review/capt-jack-review.component';

@NgModule({
  declarations: [
    ChalkboardOverlayComponent,
    ChalkboardCheerComponent,
    ChalkboardPointTestComponent,
    ChalkboardSubscribeComponent,
    ChalkboardRaidComponent,
    BringFiniteWaterComponent,
    BehindYouComponent,
    MessageMatrixComponent,
    ChalkboardGiftSubComponent,
    ChalkboardSubNoMessageComponent,
    CaptJackReviewComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(ChalkboardOverlayRoutes)],
})
export class ChalkboardOverlayModule {}
