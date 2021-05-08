import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import OBSWebSocket from 'obs-websocket-js';
import { Subscription } from 'rxjs';
import { ObsWebsocketsService, stopAdvKeys, startAdvKeys } from 'src/app/services/obs-websockets.service';

@Component({
  selector: 'app-bring-finite-water',
  templateUrl: './bring-finite-water.component.html',
  styleUrls: ['./bring-finite-water.component.scss']
})
export class BringFiniteWaterComponent implements OnInit {
  private subs = new Subscription();
  @Output() redemptionComplete = new EventEmitter<null>();
  @Input() obs: OBSWebSocket;
  step = '';
  constructor(private obsService: ObsWebsocketsService) { }

  ngOnInit(): void {
    this.bringFiniteWater();
  }

  bringFiniteWater() {
    const effect = Math.floor(Math.random() * 5) + 1;
    if(effect === 1) {
      this.finiteWater1();
    } else if (effect === 2) {
      this.finiteWater2();
    } else if (effect === 3) {
      this.finiteWater3();
    } else if(effect === 4) {
      this.finiteWater4();
    } else if(effect === 5) {
      this.finiteWater5();
    } else if(effect === 6) {
      this.finiteWater6();
    }
  }

  finiteWater1() {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: 'bring-finite-water-1',
      filterName: 'Opacity',
      filterSettings: {
        'opacity': 0,
      }
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      'item': { 'name': 'bring-finite-water-1' },
      'visible': true,
      position: {},
      bounds: {},
      scale: {},
      crop: {}
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'bring-finite-water-1',
      filterName: 'FadeIn',
      filterEnabled: true
    });
    setTimeout(() => {
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'Super Composite',
        filterName: 'BFW1-1',
        filterEnabled: true
      })
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'DSLR Face Cam GS For Mask',
        filterName: 'BFW1-1',
        filterEnabled: true
      })
    }, 500);
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        'item': { 'name': 'bring-finite-water-1' },
        'visible': false,
        position: {},
        bounds: {},
        scale: {},
        crop: {}
      });
      this.redemptionComplete.emit();
    }, 23000);
  }

  finiteWater2() {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: 'bring-finite-water-2',
      filterName: 'Opacity',
      filterSettings: {
        'opacity': 0,
      }
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      'item': { 'name': 'bring-finite-water-2' },
      'visible': true,
      position: {},
      bounds: {},
      scale: {},
      crop: {}
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'bring-finite-water-2',
      filterName: 'FadeIn',
      filterEnabled: true
    });
    setTimeout(() => {
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'Super Composite',
        filterName: 'BFW2-1',
        filterEnabled: true
      })
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'DSLR Face Cam GS For Mask',
        filterName: 'BFW2-1',
        filterEnabled: true
      })
    }, 5);
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        'item': { 'name': 'bring-finite-water-2' },
        'visible': false,
        position: {},
        bounds: {},
        scale: {},
        crop: {}
      });
      this.redemptionComplete.emit();
    }, 23000);
  }

  finiteWater3() {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: 'bring-finite-water-3',
      filterName: 'Opacity',
      filterSettings: {
        'opacity': 0,
      }
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      'item': { 'name': 'bring-finite-water-3' },
      'visible': true,
      position: {},
      bounds: {},
      scale: {},
      crop: {}
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'bring-finite-water-3',
      filterName: 'FadeIn',
      filterEnabled: true
    });
    setTimeout(() => {
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'Super Composite',
        filterName: 'BFW3-1',
        filterEnabled: true
      })
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'DSLR Face Cam GS For Mask',
        filterName: 'BFW3-1',
        filterEnabled: true
      })
    }, 5);
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        'item': { 'name': 'bring-finite-water-3' },
        'visible': false,
        position: {},
        bounds: {},
        scale: {},
        crop: {}
      });
      this.redemptionComplete.emit();
    }, 36000);
  }

  finiteWater4() {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: 'bring-finite-water-4',
      filterName: 'Opacity',
      filterSettings: {
        'opacity': 0,
      }
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      'item': { 'name': 'bring-finite-water-4' },
      'visible': true,
      position: {},
      bounds: {},
      scale: {},
      crop: {}
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'bring-finite-water-4',
      filterName: 'FadeIn',
      filterEnabled: true
    });
    setTimeout(() => {
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'Super Composite',
        filterName: 'BFW4-1',
        filterEnabled: true
      })
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'DSLR Face Cam GS For Mask',
        filterName: 'BFW4-1',
        filterEnabled: true
      })
    }, 5);
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        'item': { 'name': 'bring-finite-water-4' },
        'visible': false,
        position: {},
        bounds: {},
        scale: {},
        crop: {}
      });
      this.redemptionComplete.emit();
    }, 36000);
  }

  finiteWater5() {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: 'bring-finite-water-5',
      filterName: 'Opacity',
      filterSettings: {
        'opacity': 0,
      }
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      'item': { 'name': 'bring-finite-water-5' },
      'visible': true,
      position: {},
      bounds: {},
      scale: {},
      crop: {}
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'bring-finite-water-5',
      filterName: 'FadeIn',
      filterEnabled: true
    });
    setTimeout(() => {
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'Super Composite',
        filterName: 'BFW5-1',
        filterEnabled: true
      })
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'DSLR Face Cam GS For Mask',
        filterName: 'BFW5-1',
        filterEnabled: true
      })
    }, 5);
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        'item': { 'name': 'bring-finite-water-5' },
        'visible': false,
        position: {},
        bounds: {},
        scale: {},
        crop: {}
      });
      this.redemptionComplete.emit();
    }, 11000);
  }

  finiteWater6() {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: 'bring-finite-water-6',
      filterName: 'Opacity',
      filterSettings: {
        'opacity': 0,
      }
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      'item': { 'name': 'bring-finite-water-6' },
      'visible': true,
      position: {},
      bounds: {},
      scale: {},
      crop: {}
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'bring-finite-water-6',
      filterName: 'FadeIn',
      filterEnabled: true
    });
    setTimeout(() => {
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'Super Composite',
        filterName: 'BFW6-1',
        filterEnabled: true
      })
      this.obs.send('SetSourceFilterVisibility', {
        sourceName: 'DSLR Face Cam GS For Mask',
        filterName: 'BFW6-1',
        filterEnabled: true
      })
    }, 5);
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        'item': { 'name': 'bring-finite-water-6' },
        'visible': false,
        position: {},
        bounds: {},
        scale: {},
        crop: {}
      });
      this.redemptionComplete.emit();
    }, 43000);
  }

}
