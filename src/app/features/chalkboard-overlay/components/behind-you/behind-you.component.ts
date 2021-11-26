import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import OBSWebSocket from 'obs-websocket-js';
import { MersenneTwister } from 'fast-mersenne-twister';

const videoLength = {
  1: 11000,
  2: 16000,
  3: 29000,
  4: 17500,
  5: 8000,
};

@Component({
  selector: 'app-behind-you',
  templateUrl: './behind-you.component.html',
  styleUrls: ['./behind-you.component.scss'],
})
export class BehindYouComponent implements OnInit {
  private subs = new Subscription();
  @Output() redemptionComplete = new EventEmitter<null>();
  @Output() effectSelected = new EventEmitter<number>();
  @Input() obs: OBSWebSocket;
  @Input() lastEffect = 0;
  step = '';
  constructor() {}

  ngOnInit(): void {
    console.log('behind you!');
    this.behindYou();
  }

  behindYou() {
    const rng = MersenneTwister(Date.now());
    const effect = Math.ceil(rng.random() * 5);

    this.turnOnVideo(effect);
    setTimeout(() => {
      this.turnOffVideo(effect);
    }, videoLength[effect]);
    setTimeout(() => {
      this.redemptionComplete.emit();
      this.effectSelected.emit(effect);
    }, videoLength[effect] + 600);
  }

  turnOnVideo(videoId: number) {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: `behind-you-${videoId}`,
      filterName: 'Opacity',
      filterSettings: {
        opacity: 0,
      },
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      item: { name: `behind-you-${videoId}` },
      visible: true,
      position: {},
      bounds: {},
      scale: {},
      crop: {},
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: `behind-you-${videoId}`,
      filterName: 'FadeIn',
      filterEnabled: true,
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Super Composite',
      filterName: 'Blurry',
      filterEnabled: true,
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'DSLR Face Cam GS For Mask',
      filterName: 'Blurry',
      filterEnabled: true,
    });
  }

  turnOffVideo(videoId: number) {
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: `behind-you-${videoId}`,
      filterName: 'FadeOut',
      filterEnabled: true,
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Super Composite',
      filterName: 'Sharp',
      filterEnabled: true,
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'DSLR Face Cam GS For Mask',
      filterName: 'Sharp',
      filterEnabled: true,
    });
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        item: { name: `behind-you-${videoId}` },
        visible: false,
        position: {},
        bounds: {},
        scale: {},
        crop: {},
      });
    }, 300);
  }
}
