import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import ObsWebSocket from 'obs-websocket-js';
import { MersenneTwister } from 'fast-mersenne-twister';

interface Background {
  video: string;
  audio: string;
}

interface ReviewEvent {
  event: string;
  time: number;
  duration?: number;
}

interface Review {
  video: string;
  events: ReviewEvent[];
}

const BACKGROUNDS: Background[] = [
  { video: 'capt-jack-bg-1', audio: 'capt-jack-bg-1-audio' },
  { video: 'capt-jack-bg-2', audio: 'capt-jack-bg-2-audio' },
  { video: 'capt-jack-bg-3', audio: 'capt-jack-bg-3-audio' },
];

const REVIEWS: Review[] = [
  {
    video: 'capt-jack-review-1',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 10350, duration: 1000 },
      { event: 'unblur-facecam', time: 12833, duration: 1667 },
      { event: 'blur-facecam', time: 22300, duration: 2500 },
      { event: 'door-open', time: 26333, duration: 1000 },
      { event: 'door-close', time: 30600, duration: 1000 },
      { event: 'end', time: 32000 },
    ],
  },
  {
    video: 'capt-jack-review-2',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 4333, duration: 1000 },
      { event: 'unblur-facecam', time: 5667, duration: 2333 },
      { event: 'blur-facecam', time: 18667, duration: 3000 },
      { event: 'door-open', time: 21667, duration: 1000 },
      { event: 'door-close', time: 27400, duration: 1000 },
      { event: 'end', time: 28000 },
    ],
  },
  {
    video: 'capt-jack-review-3',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 10200, duration: 1000 },
      { event: 'unblur-facecam', time: 11667, duration: 2000 },
      { event: 'blur-facecam', time: 21250, duration: 1250 },
      { event: 'end', time: 28000 },
    ],
  },
  {
    video: 'capt-jack-review-4',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 6750, duration: 1000 },
      { event: 'unblur-facecam', time: 8500, duration: 2450 },
      { event: 'blur-facecam', time: 18750, duration: 2750 },
      { event: 'door-open', time: 21250, duration: 1000 },
      { event: 'door-close', time: 26200, duration: 1000 },
      { event: 'end', time: 27500 },
    ],
  },
  {
    video: 'capt-jack-review-5',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 5900, duration: 1000 },
      { event: 'unblur-facecam', time: 7000, duration: 1750 },
      { event: 'blur-facecam', time: 15333, duration: 3333 },
      { event: 'door-open', time: 18333, duration: 1000 },
      { event: 'door-close', time: 23500, duration: 1000 },
      { event: 'end', time: 24333 },
    ],
  },
  {
    video: 'capt-jack-review-6',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 5333, duration: 1000 },
      { event: 'unblur-facecam', time: 6000, duration: 3000 },
      { event: 'blur-facecam', time: 14750, duration: 2750 },
      { event: 'door-open', time: 17500, duration: 1000 },
      { event: 'door-close', time: 22333, duration: 1000 },
      { event: 'end', time: 23200 },
    ],
  },
  {
    video: 'capt-jack-review-7',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 6000, duration: 1000 },
      { event: 'unblur-facecam', time: 7250, duration: 2750 },
      { event: 'blur-facecam', time: 18250, duration: 3250 },
      { event: 'door-open', time: 21500, duration: 1000 },
      { event: 'door-close', time: 26000, duration: 1000 },
      { event: 'end', time: 27000 },
    ],
  },
  {
    video: 'capt-jack-review-8',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 6250, duration: 1000 },
      { event: 'unblur-facecam', time: 7250, duration: 2750 },
      { event: 'blur-facecam', time: 19750, duration: 2250 },
      { event: 'door-open', time: 22000, duration: 1000 },
      { event: 'door-close', time: 26833, duration: 1000 },
      { event: 'end', time: 27500 },
    ],
  },
  {
    video: 'capt-jack-review-9',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 5500, duration: 1000 },
      { event: 'unblur-facecam', time: 7000, duration: 1500 },
      { event: 'blur-facecam', time: 18750, duration: 2750 },
      { event: 'door-open', time: 21333, duration: 1000 },
      { event: 'door-close', time: 27250, duration: 1000 },
      { event: 'end', time: 28250 },
    ],
  },
  {
    video: 'capt-jack-review-10',
    events: [
      { event: 'door-open', time: 1100, duration: 1000 },
      { event: 'door-close', time: 4666, duration: 1000 },
      { event: 'unblur-facecam', time: 5500, duration: 2000 },
      { event: 'blur-facecam', time: 15000, duration: 2750 },
      { event: 'door-open', time: 17750, duration: 1000 },
      { event: 'door-close', time: 21666, duration: 1000 },
      { event: 'end', time: 23000 },
    ],
  },
];

@Component({
  selector: 'app-capt-jack-review',
  templateUrl: './capt-jack-review.component.html',
  styleUrls: ['./capt-jack-review.component.scss'],
})
export class CaptJackReviewComponent implements OnInit {
  @Output() redemptionComplete = new EventEmitter<null>();
  @Output() updateHistory = new EventEmitter<number[]>();
  @Input() obs: ObsWebSocket;
  @Input() history: number[] = [];

  background: Background = null;
  review: Review = null;
  state: any;

  constructor() {}

  ngOnInit(): void {
    const rng = MersenneTwister(Date.now());
    const bg = Math.floor(rng.random() * 3);
    let review = Math.floor(rng.random() * 10);
    while (this.history.includes(review)) {
      review = Math.floor(rng.random() * 10);
    }
    this.history.push(review);
    if (this.history.length > 5) {
      this.history = [...this.history.slice(-5)];
    }
    this.updateHistory.emit(this.history);
    this.showCodeReview(bg, review);
  }

  async showCodeReview(bg = 0, review = 0) {
    this.background = BACKGROUNDS[bg];
    this.review = REVIEWS[review];
    await this.clearScene();
    await this.setupScene();
    this.fadeInScene();

    for (const event of this.review.events) {
      setTimeout(() => {
        this.dispatchEvent(event);
      }, event.time);
    }
  }

  dispatchEvent(event: ReviewEvent) {
    console.log(event.event);
    switch (event.event) {
      case 'door-open':
        this.doorOpen(event);
        return;
      case 'door-close':
        this.doorClose(event);
        return;
      case 'unblur-facecam':
        this.unblur(event);
        return;
      case 'blur-facecam':
        this.blur(event);
        return;
      case 'end':
        this.end(event);
        return;
    }
  }

  doorOpen(event: ReviewEvent) {
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: this.background.audio,
      filterName: 'fadeIn',
      filterEnabled: true,
    });
  }

  doorClose(event: ReviewEvent) {
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: this.background.audio,
      filterName: 'fadeOut',
      filterEnabled: true,
    });
  }

  unblur(event: ReviewEvent) {
    this.sharpenFaceCam(event.duration);
  }

  blur(event: ReviewEvent) {
    this.blurFaceCam(event.duration);
  }

  end(event: ReviewEvent) {
    this.fadeOutScene();
    setTimeout(async () => {
      await this.clearScene();
      this.redemptionComplete.emit();
    }, 1500);
  }

  async clearScene() {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: 'Captain Jack',
      filterName: 'Opacity',
      filterSettings: {
        opacity: 0,
      },
    });
    for (const bg of BACKGROUNDS) {
      await this.obs.send('SetSceneItemProperties', {
        'scene-name': 'Captain Jack Background',
        item: { name: bg.video },
        visible: false,
        position: {},
        bounds: {},
        scale: {},
        crop: {},
      });
      await this.obs.send('SetSceneItemProperties', {
        'scene-name': 'Captain Jack Background',
        item: { name: bg.audio },
        visible: false,
        position: {},
        bounds: {},
        scale: {},
        crop: {},
      });
    }
    for (const review of REVIEWS) {
      await this.obs.send('SetSceneItemProperties', {
        'scene-name': 'Captain Jack Greenscreen',
        item: { name: review.video },
        visible: false,
        position: {},
        bounds: {},
        scale: {},
        crop: {},
      });
    }
    const data = await this.obs.send('GetSourceFilterInfo', {
      sourceName: 'Super Composite',
      filterName: 'TimedSharpen',
    });
    console.log(data);
  }

  async setupScene() {
    await this.obs.send('SetSceneItemProperties', {
      'scene-name': 'Captain Jack Greenscreen',
      item: { name: this.review.video },
      visible: true,
      position: {},
      bounds: {},
      scale: {},
      crop: {},
    });

    await this.obs.send('SetSceneItemProperties', {
      'scene-name': 'Captain Jack Background',
      item: { name: this.background.video },
      visible: true,
      position: {},
      bounds: {},
      scale: {},
      crop: {},
    });

    await this.obs.send('SetSceneItemProperties', {
      'scene-name': 'Captain Jack Background',
      item: { name: this.background.audio },
      visible: true,
      position: {},
      bounds: {},
      scale: {},
      crop: {},
    });
  }

  async fadeInScene() {
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Captain Jack',
      filterName: 'FadeIn',
      filterEnabled: true,
    });
    this.blurFaceCam(500);
  }

  async fadeOutScene() {
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Captain Jack',
      filterName: 'FadeOut',
      filterEnabled: true,
    });
    this.sharpenFaceCam(500);
  }

  async blurFaceCam(duration: number) {
    await this.timedBlurFacecam('Blur', duration);
  }

  async sharpenFaceCam(duration: number) {
    await this.timedBlurFacecam('Sharpen', duration);
  }

  async timedBlurFacecam(operation: string, duration: number) {
    await this.obs.send('SetSourceFilterSettings', {
      sourceName: 'Super Composite',
      filterName: `Timed${operation}`,
      filterSettings: {
        duration,
      },
    });
    await this.obs.send('SetSourceFilterSettings', {
      sourceName: 'DSLR Face Cam GS For Mask',
      filterName: `Timed${operation}`,
      filterSettings: {
        duration,
      },
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Super Composite',
      filterName: `Timed${operation}`,
      filterEnabled: true,
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'DSLR Face Cam GS For Mask',
      filterName: `Timed${operation}`,
      filterEnabled: true,
    });
  }
}
