import { Component, OnInit } from '@angular/core';
import { TwitchEventsService } from 'src/app/services/twitch-events.service';

const broadcasterId = '536397236';

const rewards = [
  {
    id: '575c2991-cbc2-402c-837f-86bd40009379',
    name: 'writing wall',
    cost: 200,
  },
  {
    id: '146beb92-ed1e-4845-8604-3408ebabf411',
    name: 'capt jack',
    cost: 200,
  },
  {
    id: '99ef7c31-be4b-463f-8059-92c80f98ef32',
    name: 'water',
    cost: 100,
  },
  {
    id: '4fd2137c-8dd6-411b-b406-a077ce017d0f',
    name: 'behind you',
    cost: 100,
  },
];

@Component({
  selector: 'app-toggle-channel-points',
  templateUrl: './toggle-channel-points.component.html',
  styleUrls: ['./toggle-channel-points.component.scss'],
})
export class ToggleChannelPointsComponent implements OnInit {
  constructor(private twitchEvents: TwitchEventsService) {}

  ngOnInit(): void {}

  turnOff() {
    for (const reward of rewards) {
      this.twitchEvents
        .setRewardCost(broadcasterId, reward.id, 1000000)
        .subscribe((res) => console.log(res));
    }
  }

  turnOn() {
    for (const reward of rewards) {
      this.twitchEvents
        .setRewardCost(broadcasterId, reward.id, reward.cost)
        .subscribe((res) => console.log(res));
    }
  }
}
