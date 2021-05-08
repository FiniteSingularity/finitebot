import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import * as Vara from 'vara';
import OBSWebSocket from 'obs-websocket-js';

const timingsMap = {
  1: {
    eraseTimeout: 6500,
    removeChalkTimeout: 8000,
    turnOffVidTimeout: 9500,
    endTimeout: 10000,
  },
  2: {
    eraseTimeout: 4500,
    removeChalkTimeout: 6500,
    turnOffVidTimeout: 7500,
    endTimeout: 8000
  },
};

@Component({
  selector: 'app-chalkboard-raid',
  templateUrl: './chalkboard-raid.component.html',
  styleUrls: ['./chalkboard-raid.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '300px',
        height: '300px',
      })),
      state('closed', style({
        width: '0px',
        height: '0px',
      })),
      transition('open => closed', [
        animate('1s')
      ]),
      transition('closed => open', [
        animate('1s')
      ]),
    ]),
  ],
})
export class ChalkboardRaidComponent implements OnInit {
  @Input() msg: any;
  @Input() extraData: any;
  @Input() obs: OBSWebSocket;

  @Output() writingComplete = new EventEmitter<null>();

  @ViewChild('writingContainer', { static: true }) writingEle?: ElementRef;
  currentScene = '';
  vara: any;
  showProfileImage = false;

  constructor() { }

  ngOnInit(): void {
    console.log('Raid ngOnInit()');
    this.setupMessage();
  }

  setupMessage(): void {
    const data = this.msg.event_data;
    const message1 = `${data.from_broadcaster_user_name} raided`;
    const message2 = `with ${data.viewers} viewers!`
    this.writeText(message1, message2);
  }

  turnOnVideo(videoId: number) {
    this.obs.send('SetSourceFilterSettings', {
      sourceName: `raid-${videoId}`,
      filterName: 'Opacity',
      filterSettings: {
        'opacity': 0,
      }
    });
    this.obs.send('SetSceneItemProperties', {
      'scene-name': 'DSLR Face Cam Composite',
      'item': { 'name': `raid-${videoId}` },
      'visible': true,
      position: {},
      bounds: {},
      scale: {},
      crop: {}
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: `raid-${videoId}`,
      filterName: 'FadeIn',
      filterEnabled: true
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Super Composite',
      filterName: 'Blurry',
      filterEnabled: true
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'DSLR Face Cam GS For Mask',
      filterName: 'Blurry',
      filterEnabled: true
    });
  }

  turnOffVideo(videoId: number) {
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: `raid-${videoId}`,
      filterName: 'FadeOut',
      filterEnabled: true
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Super Composite',
      filterName: 'Sharp',
      filterEnabled: true
    });
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'DSLR Face Cam GS For Mask',
      filterName: 'Sharp',
      filterEnabled: true
    });
    setTimeout(() => {
      this.obs.send('SetSceneItemProperties', {
        'scene-name': 'DSLR Face Cam Composite',
        'item': { 'name': `raid-${videoId}` },
        'visible': false,
        position: {},
        bounds: {},
        scale: {},
        crop: {}
      });
    }, 300);
  }

  writeText(message1: string, message2: string) {
    const effect = Math.floor(Math.random() * 2) + 1;
    const timings = timingsMap[effect];
    // Turn on raid video
    this.turnOnVideo(effect);

    const color = '#e9d5c8';
    const ele = this.writingEle?.nativeElement;
    ele.innerHTML = "<div id='vara-container'></div>";
    this.vara = new Vara('#vara-container',
      "https://rawcdn.githack.com/akzhy/Vara/ed6ab92fdf196596266ae76867c415fa659eb348/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: message1,
          fromCurrentPosition: { y: true },
          duration: 3000,
          color,
          x: 0,
          y: 20,
        },
        {
          text: message2,
          fromCurrentPosition: { y: true },
          duration: 1000,
          color,
          x: 0,
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
        this.showProfileImage = true;
        setTimeout(() => {
          this.eraseBoard();
          this.showProfileImage = false;
        }, timings.eraseTimeout);
        setTimeout(() => {
          const ele = this.writingEle?.nativeElement;
          ele.innerHTML = "";
        }, timings.removeChalkTimeout);
        setTimeout(() => {
          this.turnOffVideo(effect);
        }, timings.turnOffVidTimeout)
        setTimeout(() => {
          ele.innerHTML = "";
          this.writingComplete.emit();
        }, timings.endTimeout);
      }
    });
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
      const mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
      const maskFill = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

      mask.setAttribute("id", "mask");

      maskFill.setAttribute("x", "0");
      maskFill.setAttribute("y", "0");
      maskFill.setAttribute("width", `${svgWidth}`);
      maskFill.setAttribute("height", `${svgHeight}`);
      maskFill.setAttribute("fill", "white");

      const numLegs = 10;
      const start = { x: bbox.xMin, y: bbox.yMin };
      const dx = (bbox.xMax - bbox.xMin) / (numLegs + 1);

      let d = `M${bbox.xMin}, ${bbox.yMin}`;
      for (let step = 0; step < numLegs; step++) {
        const y = step % 2 == 0 ? bbox.yMax : bbox.yMin;
        const x = bbox.xMin + (step + 1) * dx;
        d += ` L${x},${y}`;
      }
      path.setAttribute("d", d);
      path.setAttribute("class", "erase");
      const length = path.getTotalLength();
      path.style.strokeDasharray = length + ' ' + length;
      path.style.strokeDashoffset = `${length}`;

      mask.appendChild(maskFill);
      mask.appendChild(path);
      svg.appendChild(mask);
      g.setAttribute("mask", "url(#mask)");
      svg.appendChild(g);
      paths.filter(p => p.tagName === 'g').forEach(p => g.appendChild(p));
    }
  }
}
