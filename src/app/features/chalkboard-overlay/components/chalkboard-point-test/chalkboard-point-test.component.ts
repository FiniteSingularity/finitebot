import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import * as Vara from 'vara';
import { isString } from 'lodash';
import OBSWebSocket from 'obs-websocket-js';
import { MersenneTwister } from 'fast-mersenne-twister';

const timingsMap = {
  1: {
    startWriting: 8000,
    eraseTimeout: 10500,
    removeChalkTimeout: 14500,
    turnOffVidTimeout: 13500,
    endTimeout: 13500,
  },
  2: {
    startWriting: 8000,
    eraseTimeout: 10500,
    removeChalkTimeout: 14500,
    turnOffVidTimeout: 13500,
    endTimeout: 13500,
  },
  3: {
    startWriting: 4000,
    eraseTimeout: 10500,
    removeChalkTimeout: 14500,
    turnOffVidTimeout: 11500,
    endTimeout: 11500,
  },
  4: {
    startWriting: 6000,
    eraseTimeout: 10500,
    removeChalkTimeout: 14500,
    turnOffVidTimeout: 13500,
    endTimeout: 13500,
  },
  5: {
    startWriting: 2000,
    eraseTimeout: 9500,
    removeChalkTimeout: 10500,
    turnOffVidTimeout: 12500,
    endTimeout: 12500,
  },
  6: {
    startWriting: 2500,
    eraseTimeout: 10500,
    removeChalkTimeout: 12500,
    turnOffVidTimeout: 14500,
    endTimeout: 14500,
  },
  7: {
    startWriting: 4000,
    eraseTimeout: 10500,
    removeChalkTimeout: 17500,
    turnOffVidTimeout: 20500,
    endTimeout: 20500,
  },
  8: {
    startWriting: 4000,
    eraseTimeout: 10500,
    removeChalkTimeout: 14500,
    turnOffVidTimeout: 17500,
    endTimeout: 17500,
  },
};

@Component({
  selector: 'app-chalkboard-point-test',
  templateUrl: './chalkboard-point-test.component.html',
  styleUrls: ['./chalkboard-point-test.component.scss'],
})
export class ChalkboardPointTestComponent implements OnInit {
  @Input() msg: any;
  @Input() obs: OBSWebSocket;

  @Output() writingComplete = new EventEmitter<null>();

  @ViewChild('writingContainer', { static: true }) writingEle?: ElementRef;
  currentScene = '';
  vara: any;

  constructor() {}

  ngOnInit(): void {
    console.log('Cheer ngOnInit()');
    this.setupMessage();
  }

  setupMessage(): void {
    const data = this.msg.event_data;
    const message1 = `${data.user_name} says:`;
    const message2 = isString(data.user_input)
      ? data.user_input
      : data.user_input.message;
    this.writeText(message1, message2);
  }

  turnOnVideo(videoId: number) {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: `writing-on-wall-${videoId}`,
      filterName: 'Opacity',
      filterSettings: {
        opacity: 0,
      },
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      item: { name: `writing-on-wall-${videoId}` },
      visible: true,
      position: {},
      bounds: {},
      scale: {},
      crop: {},
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: `writing-on-wall-${videoId}`,
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
      sourceName: `writing-on-wall-${videoId}`,
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
        item: { name: `writing-on-wall-${videoId}` },
        visible: false,
        position: {},
        bounds: {},
        scale: {},
        crop: {},
      });
    }, 300);
  }

  writeText(message1: string, message2: string) {
    const rng = MersenneTwister(Date.now());
    const effect = Math.ceil(rng.random() * 8);
    const timings = timingsMap[effect];
    this.turnOnVideo(effect);

    const color = '#e9d5c8';
    const ele = this.writingEle?.nativeElement;
    ele.innerHTML = "<div id='vara-container'></div>";
    setTimeout(() => {
      this.vara = new Vara(
        '#vara-container',
        'https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json',
        [
          {
            text: message1,
            fromCurrentPosition: { y: true },
            duration: 3000,
            color,
            x: 20,
            y: 20,
          },
          {
            text: message2,
            fromCurrentPosition: { y: true },
            duration: 1000,
            color,
            x: 5,
            y: 20,
          },
        ],
        {
          fontSize: 64,
          strokeWidth: 2,
          textAlign: 'center',
        }
      ).animationEnd((i, o) => {
        if (i == 1) {
          setTimeout(() => {
            this.eraseBoard();
          }, timings.eraseTimeout);
          setTimeout(() => {
            const ele = this.writingEle?.nativeElement;
            ele.innerHTML = '';
          }, timings.removeChalkTimeout);
          setTimeout(() => {
            this.turnOffVideo(effect);
          }, timings.turnOffVidTimeout);
          setTimeout(() => {
            ele.innerHTML = '';
            this.writingComplete.emit();
          }, timings.endTimeout);
        }
      });
    }, timings.startWriting);
  }

  eraseBoard() {
    // TODO: Make this simpler!
    const varaContainer = document.getElementById('vara-container');
    if (varaContainer) {
      const svg = varaContainer.getElementsByTagName('svg')[0];
      const svgWidth = svg.getBoundingClientRect().width;
      const svgHeight = svg.getBoundingClientRect().height;
      const paths = Array.from(svg.children);
      const bbox = { xMin: 999, xMax: -999, yMin: 999, yMax: -999 };
      paths.forEach((p: any) => {
        const pBbox = p.getBoundingClientRect();
        bbox.xMin = Math.min(bbox.xMin, pBbox.x);
        bbox.yMin = Math.min(bbox.yMin, pBbox.y);
        bbox.xMax = Math.max(bbox.xMax, pBbox.x + pBbox.width);
        bbox.yMax = Math.max(bbox.yMax, pBbox.y + pBbox.height);
      });
      const mask = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'mask'
      );
      const maskFill = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      const path = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      mask.setAttribute('id', 'mask');

      maskFill.setAttribute('x', '0');
      maskFill.setAttribute('y', '0');
      maskFill.setAttribute('width', `${svgWidth}`);
      maskFill.setAttribute('height', `${svgHeight}`);
      maskFill.setAttribute('fill', 'white');

      const numLegs = 10;
      const start = { x: bbox.xMin, y: bbox.yMin };
      const dx = (bbox.xMax - bbox.xMin) / (numLegs + 1);

      let d = `M${bbox.xMin}, ${bbox.yMin}`;
      for (let step = 0; step < numLegs; step++) {
        const y = step % 2 == 0 ? bbox.yMax : bbox.yMin;
        const x = bbox.xMin + (step + 1) * dx;
        d += ` L${x},${y}`;
      }
      path.setAttribute('d', d);
      path.setAttribute('class', 'erase');
      const length = path.getTotalLength();
      path.style.strokeDasharray = length + ' ' + length;
      path.style.strokeDashoffset = `${length}`;

      mask.appendChild(maskFill);
      mask.appendChild(path);
      svg.appendChild(mask);
      g.setAttribute('mask', 'url(#mask)');
      svg.appendChild(g);
      paths.filter((p) => p.tagName === 'g').forEach((p) => g.appendChild(p));
    }
  }
}
