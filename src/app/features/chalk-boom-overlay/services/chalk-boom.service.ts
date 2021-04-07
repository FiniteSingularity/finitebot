import { Injectable } from '@angular/core';
import { Point } from 'src/app/models/point';

export interface PlayerData {
  position: Point;
  boomAmount: number;
  name: string;
  angle: number;
  xDir: number;
  yDir: number;
  spriteWidth: number;
  spriteHeight: number;
  teamColor: string;
  boomColor: string;
  teamName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChalkBoomService {
  players: {[key: string]: PlayerData} = {};

  constructor() { }

  addPlayer(data: PlayerData) {
    if(!(data.name in this.players)) {
      this.players[data.name] = {
        ...data
      };
    }
  }

  getPlayer(name: string): PlayerData {
    return { ...this.players[name] };
  }

  updatePlayer(data: PlayerData) {
    if(data.name in this.players) {
      this.players[data.name] = {...data};
    }
  }

  updateBoomAmmount(additionalBoom: number) {
    for(const key of Object.keys(this.players)) {
      const newBoom = this.players[key].boomAmount + additionalBoom;
      this.players[key].boomAmount = Math.min(newBoom, 1.0);
    }
  }

  clearPlayers() {
    this.players = {};
  }
}
