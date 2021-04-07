import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Point } from 'src/app/models/point';
import { TeamData } from '../../chalk-boom-overlay.component';
import { ChalkBoomService, PlayerData } from '../../services/chalk-boom.service';

@Component({
  selector: 'app-rocket',
  templateUrl: './rocket.component.html',
  styleUrls: ['./rocket.component.scss']
})
export class RocketComponent implements OnInit, OnChanges {
  @Input() progress = 0;
  @Input() speed = 100;
  @Input() player = '';
  @Input() teamData: TeamData = {
    chalk: '#FFFFFF',
    player: '#FFFFFF',
    name: 'team',
  };
  setup = false;

  data: PlayerData = {
    name: '',
    boomAmount: 0,
    position: {x: 0, y: 0},
    angle: 0,
    xDir: 1,
    yDir: 1,
    spriteWidth: 24,
    spriteHeight: 24,
    teamColor: '',
    boomColor: '',
    teamName: '',
  }
  boomAmount = 0.5;

  constructor(
    private chalkBoom: ChalkBoomService
  ) { }

  ngOnInit(): void {
    this.data.name = this.player;
    this.data.teamColor = this.teamData.player;
    this.data.boomColor = this.teamData.chalk;
    this.data.teamName = this.teamData.name;
    this.data.boomAmount = 0.5;
    this.randomizeStart();
    this.setup = true;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if(this.setup)
    this.update();
  }

  randomizeStart(): void {
    const width = Math.random() * (window.innerWidth - this.data.spriteWidth);
    const height = Math.random() * (window.innerHeight - this.data.spriteHeight);
    this.data.angle = 2.0 * Math.PI * Math.random();
    this.data.position = {x: width/2, y: height/2};
    if(this.data.angle >= Math.PI/2.0 && this.data.angle < 3.0*Math.PI/2.0) {
      this.data.xDir = -1;
    } else {
      this.data.xDir = 1;
    }

    if(this.data.angle <= Math.PI) {
      this.data.yDir = -1;
    } else {
      this.data.yDir = 1;
    }

    this.chalkBoom.addPlayer({
      ...this.data
    });
  }

  updatePlayer(): void {
    this.chalkBoom.updatePlayer(this.data);
  }

  update(): void {
    this.data = this.chalkBoom.getPlayer(this.data.name);
    const width = window.innerWidth - this.data.spriteWidth;
    const height = window.innerHeight - this.data.spriteHeight;

    const distance = this.progress/1000.0 * this.speed;

    let newX = this.data.position.x;
    if(Math.abs(Math.cos(this.data.angle)) > 1e-8) {
      newX = this.data.position.x + distance * Math.cos(this.data.angle);
    }
    let newY = this.data.position.y;
    if(Math.abs(Math.sin(this.data.angle)) > 1e-8) {
      newY = this.data.position.y - distance * Math.sin(this.data.angle);
    }

    const angleChange = newX > width || newX < 0 || newY > height || newY < 0;

    if(newX > width) {
      const xDiff = newX - width;
      newX = width-xDiff;
      if(this.data.yDir > 0) {
        const theta = this.data.angle - 3.0*Math.PI/2.0;
        this.data.angle = 3.0*Math.PI/2.0 - theta;
      } else {
        const theta = Math.PI/2.0 - this.data.angle;
        this.data.angle = Math.PI/2.0 + theta;
      }
      this.data.xDir = -1;
    } else if(newX < 0) {
      const xDiff = -newX;
      newX = xDiff;
      if(this.data.yDir > 0) {
        const theta = 3.0*Math.PI/2.0-this.data.angle;
        this.data.angle = 3.0*Math.PI/2.0 + theta;
      } else {
        const theta = this.data.angle - Math.PI/2.0;
        this.data.angle = Math.PI/2.0 - theta;
      }
      this.data.xDir = 1;
    }

    if(newY > height) {
      const yDiff = newY - height;
      newY = height - yDiff;
      if(this.data.xDir > 0) {
        const theta = 2.0*Math.PI - this.data.angle;
        this.data.angle = theta;
      } else {
        const theta = this.data.angle - Math.PI;
        this.data.angle = Math.PI - theta;
      }
      this.data.yDir = -1;
    } else if(newY < 0) {
      const yDiff = -newY;
      newY = yDiff;
      if(this.data.xDir > 0) {
        const theta = this.data.angle;
        this.data.angle = 2.0*Math.PI - theta;
      } else {
        const theta = Math.PI - this.data.angle;
        this.data.angle = Math.PI + theta;
      }
      this.data.yDir = 1;
    }

    if(angleChange) {
      const randomJitter = Math.random() * Math.PI/(9.0);
      this.data.angle += Math.sign(this.data.angle) * randomJitter;
    }

    this.data.position = {x: newX, y: newY};
    this.updatePlayer();
    // console.log(this.position);
  }
}
