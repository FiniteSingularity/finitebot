import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ɵɵsetComponentScope } from '@angular/core';
import ComfyJS from 'comfy.js';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { Point } from 'src/app/models/point';
import { ChalkBoomService, PlayerData } from './services/chalk-boom.service';
import { Circle } from 'src/app/models/circle';
import { BoundingBox } from 'src/app/models/bounding-box';

interface Teams {
  [key: string]: string[];
};

interface Player {
  name: string;
  team: string;
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export interface TeamData {
  chalk: string;
  player: string;
  name: string;
}

const TeamColors: { [key: string]: TeamData } = {
  Red: {
    chalk: '#FF0000',
    player: '#ffcccc',
    name: 'Red' 
  },
  Blue: {
    chalk: '#0066ff',
    player: '#66ccff',
    name: 'Blue'
  }
}

export interface BoomData {
  'position': Point,
  'color': string,
  'radius': number;
  'currentRadius': number;
  'overlap': BoomData[];
  'player': PlayerData;
}

@Component({
  selector: 'app-chalk-boom-overlay',
  templateUrl: './chalk-boom-overlay.component.html',
  styleUrls: ['./chalk-boom-overlay.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        width: '128px',
        height: '128px',
        'border-radius': '64px'
      })),
      state('closed', style({
        width: '0px',
        height: '0px',
        'border-radius': '64px'
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
export class ChalkBoomOverlayComponent implements OnInit {
  @ViewChild('ball', { static: true }) ball?: ElementRef;

  phase = 'startup';
  gameTime = 90000;
  startupTime = 20000;
  elapsedTime = 0;
  startTime = 0;
  booms: BoomData[] = [];
  lastRender = 0;
  speed = 450; // px/sec
  boomAcc = 0.025 // acc per second
  angle = 0.5 * Math.PI;
  boom = false;
  fps = 0;
  scores: { [key: string]: number } = {};

  boomRate = 15;

  progress = 0;

  players: Player[] = [
  ];
  teams: Teams = {
    red: [],
    blue: [],
  }

  position: Point = { x: 0, y: 0 };
  boomPosition: Point = { x: 0, y: 0 };
  xDir = 1;
  yDir = 1;

  spriteWidth = 24;
  spriteHeight = 24;

  constructor(
    private cdr: ChangeDetectorRef,
    private chalkBoom: ChalkBoomService
  ) { }

  ngOnInit(): void {
    console.log('boom overlay component ngoninit');
    setTimeout(() => {
      this.gameInit();
    }, this.startupTime);
    this.chatInit();
    this.startup();
  }

  startup() {

  }

  gameInit(): void {
    this.phase = 'playing';
    shuffleArray(this.players);
    this.players.forEach((player, index) => {
      if (index % 2 === 0) {
        player.team = 'Red';
      } else {
        player.team = 'Blue'
      }
    });

    window.requestAnimationFrame((t) => this.startGame(t));
  }

  chatInit(): void {
    ComfyJS.onCommand = (user, command, message, flags, extra) => {
      if (command === "boom") {
        const playerData = this.chalkBoom.getPlayer(user);
        if (playerData) {
          const boomData: BoomData = {
            position: { ...playerData.position },
            color: playerData.boomColor,
            radius: playerData.boomAmount * 128,
            overlap: [],
            player: playerData,
            currentRadius: 0
          };

          const underlying = this.booms.filter(boom => {
            const rSum = boom.radius + playerData.boomAmount * 128;
            const d2 = (boom.position.x - playerData.position.x) ** 2 +
              (boom.position.y - playerData.position.y) ** 2
            return d2 < (rSum ** 2);
          });
          this.booms.push(boomData);
          underlying.forEach(boom => {
            boom.overlap.push(boomData);
          });
          this.chalkBoom.updatePlayer({
            ...playerData,
            boomAmount: 0,
          })
          this.cdr.detectChanges();
        }
      } else if (command === "me" && this.phase === 'startup') {
        if (!this.players.find((player) => player.name === user)) {
          this.players.push({ name: user, team: '' });
        }
      } else if (command === "me") {
        if (!this.players.find((player) => player.name === user)) {
          const teamCounts = this.players.reduce((acc, player) => {
              acc[player.team] += 1;
              return acc;
            }, 
            {'Red': 0, 'Blue': 0}
          );
          const team = teamCounts.Red > teamCounts.Blue ? 'Blue' : 'Red';
          this.players.push({ name: user, team});
          if(!(team in this.scores)) {
            this.scores[team] = 0;
          }
        }
      }
    }
    ComfyJS.Init("FiniteSingularity");
  }

  randomizeStart(): void {
    const width = Math.random() * (window.innerWidth - this.spriteWidth);
    const height = Math.random() * (window.innerHeight - this.spriteHeight);
    this.angle = 2.0 * Math.PI * Math.random();
    this.position = { x: width / 2, y: height / 2 };
    if (this.angle >= Math.PI / 2.0 && this.angle < 3.0 * Math.PI / 2.0) {
      this.xDir = -1;
    } else {
      this.xDir = 1;
    }

    if (this.angle <= Math.PI) {
      this.yDir = -1;
    } else {
      this.yDir = 1;
    }
  }

  startGame(timestamp: number): void {
    this.elapsedTime = timestamp;
    this.lastRender = timestamp;
    this.startTime = this.elapsedTime;
    Object.keys(this.chalkBoom.players).forEach(key => {
      this.scores[this.chalkBoom.players[key].teamName] = 0;
    });
    window.requestAnimationFrame((t) => this.gameLoop(t));
  }

  gameLoop(timestamp: number): void {
    this.progress = timestamp - this.lastRender;
    this.fps = 1.0 / (this.progress / 1000.0);
    this.update(this.progress);
    this.elapsedTime = timestamp;
    this.lastRender = timestamp;
    console.log(this.elapsedTime)
    if(this.gameTime - (this.elapsedTime - this.startTime) > 0) {
      window.requestAnimationFrame((t) => this.gameLoop(t));
    } else {
      this.phase = 'winner';
    }
  }

  winner() {
    let highScore = -1;
    let winner = 'na';
    Object.keys(this.scores).forEach((key) => {
      if(this.scores[key] > highScore) {
        winner = key;
        highScore = this.scores[key];
      }
    });
    return winner;
  }

  update(progress: number): void {
    this.chalkBoom.updateBoomAmmount(progress / 1000.0 * this.boomAcc);
    this.calculateScore();
  }

  teamData(player: Player): any {
    return TeamColors[player.team];
  }

  calculateScore(): void {
    Object.keys(this.scores).forEach(key => {
      this.scores[key] = 0;
    });
    this.booms.forEach(boom => {
      const score = this.calculateBoomContribution(boom);
      this.scores[boom.player.teamName] += score;
    });

    Object.keys(this.scores).forEach(key => {
      this.scores[key] /= (window.innerHeight * window.innerWidth);
    });
    this.scores = { ...this.scores };
  }

  calculateBoomContribution(boom: BoomData): number {
    const circle: Circle = {
      center: boom.position,
      r: boom.currentRadius,
      color: null
    };
    const overlapCircles = boom.overlap.map(overlapBoom => {
      return {
        center: overlapBoom.position,
        r: overlapBoom.currentRadius,
        color: null
      }
    })
    const compoundArea = this.estimateCompoundArea(circle, overlapCircles);
    return compoundArea;
  }

  estimateCompoundArea(circle: Circle, overlapCircles: Circle[], binSize = 1): number {
    let area = 0
    const bb = this.getBoundingBox(circle);
    for (let y = bb.minBound.y; y <= bb.maxBound.y; y += binSize) {
      let checked = false;
      let cBounds = this.scanLineBounds(circle, y);
      let scanLineArea = (cBounds.xMax - cBounds.xMin) * binSize;
      if(isNaN(scanLineArea)) {
        continue;
      }
      const scanLineOverlap = overlapCircles.filter(c => {
        return (c.center.y - c.r <= y) && (c.center.y + c.r >= y)
      });
      let overlapBounds: { xMin: number, xMax: number }[] = [];
      scanLineOverlap.forEach(slo => {
        const bounds = this.scanLineBounds(slo, y);
        if (bounds.xMin < cBounds.xMax && bounds.xMax > cBounds.xMin) {
          bounds.xMin = Math.max(bounds.xMin, cBounds.xMin);
          bounds.xMax = Math.min(bounds.xMax, cBounds.xMax);
          overlapBounds.push({ ...bounds });
        }
      });
      overlapBounds = overlapBounds.sort((a, b) => a.xMin < b.xMin ? -1 : 1);

      const constrainedBounds = [];
      overlapBounds.forEach((bounds) => {
        const length = constrainedBounds.length;
        if (length === 0) {
          constrainedBounds.push({ ...bounds });
        } else if (bounds.xMin <= constrainedBounds[length - 1].xMax) {
          constrainedBounds[length - 1].xMax = bounds.xMax
        } else {
          constrainedBounds.push({ ...bounds });
        }
      });
      constrainedBounds.forEach(bounds => {
        scanLineArea -= (bounds.xMax - bounds.xMin);
      })
      area += scanLineArea;
    }

    return area;
  }

  scanLineBounds(circle: Circle, y: number) {
    const c = Math.sqrt(circle.r ** 2 - (y - circle.center.y) ** 2)
    const xMin = circle.center.x - c;
    const xMax = circle.center.x + c;
    return { xMin, xMax };
  }

  getBoundingBox(circle: Circle): BoundingBox {
    return {
      minBound: { x: circle.center.x - circle.r, y: circle.center.y - circle.r },
      maxBound: { x: circle.center.x + circle.r, y: circle.center.y + circle.r }
    };
  }

  currentRadius(value: number, index: number): void {
    this.booms[index].currentRadius = value;
  }

}
