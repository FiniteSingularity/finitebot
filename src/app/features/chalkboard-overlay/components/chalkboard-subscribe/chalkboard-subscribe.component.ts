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

@Component({
  selector: 'app-chalkboard-subscribe',
  templateUrl: './chalkboard-subscribe.component.html',
  styleUrls: ['./chalkboard-subscribe.component.scss'],
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
export class ChalkboardSubscribeComponent implements OnInit {
  @Input() msg: any;
  @Input() extraData: any;

  @Output() writingComplete = new EventEmitter<null>();

  @ViewChild('writingContainer', { static: true }) writingEle?: ElementRef;
  currentScene = '';
  vara: any;
  showProfileImage = false;

  constructor() { }

  ngOnInit(): void {
    this.setupMessage();
  }

  setupMessage(): void {
    const data = this.msg.event_data.data.message;
    const tier = data.sub_plan === '1000' ? 'at Tier 1' :
      data.sub_plan === '2000' ? 'at Tier 2' :
        data.sub_play === '3000' ? 'at Tier 3' :
          'with prime';

    const duration = data.cumulative_months === "1" ? '' :
      `for ${data.cumulative_months} months`;

    const message1 = `${data.display_name} Subscribed`;
    const message2 = `${tier} ${duration}`;
    const message3 = data.sub_message.message;
    this.writeText(message1, message2, message3);
  }

  writeText(message1: string, message2: string, message3: string) {
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
          y: 8,
        },
        {
          text: message2,
          fromCurrentPosition: { y: true },
          duration: 1000,
          color,
          x: 0,
          y: 8,
          fontSize: 64,
        },
        {
          text: message3,
          fromCurrentPosition: { y: true },
          duration: 2000,
          color,
          x: 0,
          y: 8,
        },
      ],
      {
        fontSize: 64,
        strokeWidth: 2,
        textAlign: 'center',
      }
    ).animationEnd((i, o) => {
      if (i == 2) {
        this.showProfileImage = true;
        setTimeout(() => {
          this.showProfileImage = false;
          this.eraseBoard();
        }, 3000);
        setTimeout(() => {
          ele.innerHTML = "";
          this.writingComplete.emit();
        }, 4500);
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
