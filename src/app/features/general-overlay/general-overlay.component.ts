import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import OBSWebSocket from 'obs-websocket-js';
import { Subscription } from 'rxjs';
import { TwitchEventsService, TwitchEvent } from 'src/app/services/twitch-events.service';

const IGNORE_SCENES = ['Alert'];

@Component({
  selector: 'app-general-overlay',
  templateUrl: './general-overlay.component.html',
  styleUrls: ['./general-overlay.component.scss']
})
export class GeneralOverlayComponent implements OnInit {
  obs = new OBSWebSocket();
  obsReady = false;
  scene = '';
  subs = new Subscription();
  eventQueue: TwitchEvent[] = [];

  currentMessage = '';
  currentOverlay = '';

  constructor(
    private twitchEvents: TwitchEventsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.twitchEvents.connect();

    this.obs.connect({ address: 'localhost:4444'}).then(() => {
      console.log('Connection to OBS!');
      return;
    }).then(() => {
      this.obsReady = true;
      return this.obs.send('GetSceneList');
    }).then((data) => {
      this.scene = data['current-scene'];
      console.log(`The current scene is ${this.scene}`);
    });
    this.obs.on('SwitchScenes', data => {
      this.scene = data['scene-name'];
      console.log(`The current scene is ${this.scene}`);
    });

    this.subs.add(this.twitchEvents.message.subscribe(msg => {
      console.log(msg);
      if(!msg || IGNORE_SCENES.includes(this.scene)) {
        return;
      }
      if(msg.event_type === 'follow') {
        this.eventQueue.push({overlay: 'follow', eventData: msg, blur: false});
      }
      if(this.eventQueue.length === 1) {
        this.checkEventQueue(true);
      }
    }));
  }
  checkEventQueue(originalEvent: boolean) {
    console.log(this.eventQueue);
    if(this.eventQueue.length === 1 && originalEvent) {
      const event = this.eventQueue[0];
      this.clearCurrentEvent();
      this.currentMessage = event.eventData;
      this.currentOverlay = event.overlay;
    } else if(this.eventQueue.length > 0 && !originalEvent)  {
      const event = this.eventQueue[0];
      this.clearCurrentEvent();
      this.currentMessage = event.eventData;
      this.currentOverlay = event.overlay;
    } else if(this.eventQueue.length === 0) {
      this.clearCurrentEvent();
    }
  }

  clearCurrentEvent() {
    this.currentMessage = '';
    this.currentOverlay = '';
    this.cdr.detectChanges();
  }

  displayComplete() {
    console.log('Display Complete')
    console.log(this.eventQueue);
    this.eventQueue.shift();
    this.checkEventQueue(false);
  }

}
