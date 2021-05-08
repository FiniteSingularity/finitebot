import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ObsWebsocketsService, stopAdvKeys, startAdvKeys } from 'src/app/services/obs-websockets.service';
import OBSWebSocket from 'obs-websocket-js';
import { TwitchEventsService, TwitchEvent } from 'src/app/services/twitch-events.service';

@Component({
  selector: 'app-chalkboard-overlay',
  templateUrl: './chalkboard-overlay.component.html',
  styleUrls: ['./chalkboard-overlay.component.scss']
})
export class ChalkboardOverlayComponent implements OnInit {
  private subs = new Subscription();
  obs = new OBSWebSocket();

  currentScene: string = '';
  currentOverlay: string = '';
  currentMessage: any;
  currentExtraData: any;

  obsReady = false;
  logMsg = '';

  eventQueue: TwitchEvent[] = [];

  constructor(
    private twitchEvents: TwitchEventsService,
    private obsWs: ObsWebsocketsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.twitchEvents.connect();
    this.obsWs.connect();
    this.obs.connect({ address: 'localhost:4444'}).then(() => {
      console.log('Connection to OBS!');
      return;
    }).then(() => {
      this.obsReady = true;
    });

    this.subs.add(this.twitchEvents.message.subscribe(async msg => {
      if(!msg) {
        return;
      }
      console.log(msg);
      if(msg.event_type === 'cheer') {
        const extraData = await this.twitchEvents
                            .getTwitchUserData(msg.event_data.user_login)
                            .toPromise();
        this.eventQueue.push({overlay: 'cheer', eventData: msg, extraData, blur: true});
      } else if(msg.event_type === 'point-redemption' && msg.event_data.reward.id === '575c2991-cbc2-402c-837f-86bd40009379') {
        console.log('write on the wall');
        this.eventQueue.push({ overlay: 'point-test', eventData: msg, blur: true});
      } else if (msg.event_type === 'point-redemption' && msg.event_data.reward.id === '99ef7c31-be4b-463f-8059-92c80f98ef32') {
        console.log('bring water!');
        this.eventQueue.push({ overlay: 'bring-water', eventData: msg, blur: false});
      } else if(msg.event_type === 'subscribe') {
        const username = msg.event_data.message.user_name;
        const extraData = await this.twitchEvents
                            .getTwitchUserData(username)
                            .toPromise();
        this.eventQueue.push({ overlay: 'subscribe', eventData: msg, extraData, blur: true});
      } else if(msg.event_type === 'raid') {
        const extraData = await this.twitchEvents
                            .getTwitchUserData(msg.event_data.from_broadcaster_user_name)
                            .toPromise();
        this.eventQueue.push({ overlay: 'raid', eventData: msg, extraData, blur: false});
      }
      console.log(msg);
      if(this.eventQueue.length === 1) {
        this.obsCheckEventQueue(true);
      }
    }));
  }

  obsCheckEventQueue(originalEvent: boolean) {
    if(originalEvent && this.eventQueue.length === 1) {
      const event = this.eventQueue[0];
      this.clearCurrentEvent();
      this.obsSceneToAlert(event.eventData, event.overlay, event.extraData, event.blur);
    } else if(!originalEvent && this.eventQueue.length > 0) {
      const event = this.eventQueue[0];
      this.clearCurrentEvent();
      this.obsAlert(event.eventData, event.overlay, event.extraData, event.blur);
    } else if(this.eventQueue.length === 0) {
      this.clearCurrentEvent();
    }
  }

  clearCurrentEvent() {
    this.currentMessage = null;
    this.currentOverlay = '';
    this.currentExtraData = null;
    this.cdr.detectChanges();
  }

  obsSceneToAlert(msg: any, overlay: string, extraData: any, blur: boolean) {
    this.obsWs.sendMessage({
      "request-type":"TriggerHotkeyBySequence",
      ...stopAdvKeys,
      "message-id": "12345"
    });
    this.obs.send('GetCurrentScene').then(data => {
      this.currentScene = data.name;
    }).then(() => {
      this.obs.send('SetCurrentScene', {
        'scene-name': 'Alerts GS'
      });
      if(blur) {
        setTimeout(() => {
          this.obs.send('SetSourceFilterVisibility', {
            'sourceName': 'Super Composite',
            'filterName': 'Blurry',
            'filterEnabled': true
          });
          this.obs.send('SetSourceFilterVisibility', {
            'sourceName': 'DSLR Face Cam GS For Mask',
            'filterName': 'Blurry',
            'filterEnabled': true
          });
          this.obs.send('SetSourceFilterVisibility', {
            'sourceName': 'Office BG GS',
            'filterName': 'Sharp',
            'filterEnabled': true
          });
        }, 750);
      }


      setTimeout(() => {
        this.currentMessage = msg;
        this.currentOverlay = overlay;
        this.currentExtraData = extraData;
      }, 1500)
    });
  }

  obsAlert(msg: any, overlay: string, extraData: any, blur: boolean) {
    this.currentMessage = msg;
    this.currentOverlay = overlay;
    this.currentExtraData = extraData;
  }

  writingComplete() {
    this.eventQueue.shift();
    if(this.eventQueue.length > 0) {
      this.obsCheckEventQueue(false);
      return;
    } else {
      this.clearCurrentEvent();
    }
    this.obs.send('SetCurrentScene', {
      'scene-name': this.currentScene
    });
    this.obs.send('SetSourceFilterVisibility', {
      'sourceName': 'Super Composite',
      'filterName': 'Sharp',
      'filterEnabled': true
    });
    this.obs.send('SetSourceFilterVisibility', {
      'sourceName': 'DSLR Face Cam GS For Mask',
      'filterName': 'Sharp',
      'filterEnabled': true
    });
    this.obs.send('SetSourceFilterVisibility', {
      'sourceName': 'Office BG GS',
      'filterName': 'Blurry',
      'filterEnabled': true
    });
    this.obsWs.sendMessage({
      "request-type":"TriggerHotkeyBySequence",
      ...startAdvKeys,
      "message-id": "54321"
    });
  }

}
