import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ObsWebsocketsService,
  stopAdvKeys,
  startAdvKeys,
} from 'src/app/services/obs-websockets.service';
import OBSWebSocket from 'obs-websocket-js';
import {
  TwitchEventsService,
  TwitchEvent,
} from 'src/app/services/twitch-events.service';
import { HttpClient } from '@angular/common/http';
import { EmoteMessage, MatrixMessageRow } from 'src/app/models/emote-message';
import { MersenneTwister } from 'fast-mersenne-twister';
@Component({
  selector: 'app-chalkboard-overlay',
  templateUrl: './chalkboard-overlay.component.html',
  styleUrls: ['./chalkboard-overlay.component.scss'],
})
export class ChalkboardOverlayComponent implements OnInit {
  private subs = new Subscription();
  obs = new OBSWebSocket();

  currentScene: string = '';
  currentOverlay: string = '';
  currentMessage: any;
  currentExtraData: any;

  currentScene$: string = '';

  obsReady = false;
  logMsg = '';
  lastBehindYou = 0;

  eventQueue: TwitchEvent[] = [];

  lastScenes = {
    captJackReview: [],
  };

  constructor(
    private twitchEvents: TwitchEventsService,
    private obsWs: ObsWebsocketsService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.twitchEvents.connect();
    this.obsWs.connect();
    this.obs
      .connect({ address: 'localhost:4444' })
      .then(() => {
        console.log('Connection to OBS!');
        return;
      })
      .then(() => {
        this.obsReady = true;
      });

    this.obs.on('SwitchScenes', (data) => {
      this.currentScene$ = data['scene-name'];
    });

    this.subs.add(
      this.twitchEvents.message.subscribe(async (msg) => {
        if (!msg) {
          return;
        }
        console.log(msg);
        if (msg.event_type === 'channel-cheer') {
          const extraData = await this.twitchEvents
            .getTwitchUserData(msg.event_data.user_login)
            .toPromise();
          this.eventQueue.push({
            overlay: 'cheer',
            eventData: msg,
            extraData,
            blur: true,
          });
        } else if (
          msg.event_type ===
            'channel-channel_points_custom_reward_redemption-add' &&
          msg.event_data.reward.id === '575c2991-cbc2-402c-837f-86bd40009379'
        ) {
          console.log('write on the wall');
          this.eventQueue.push({
            overlay: 'point-test',
            eventData: msg,
            blur: false,
          });
        } else if (
          msg.event_type ===
            'channel-channel_points_custom_reward_redemption-add' &&
          msg.event_data.reward.id === '146beb92-ed1e-4845-8604-3408ebabf411'
        ) {
          console.log('Cpt. Jack Review');
          this.eventQueue.push({
            overlay: 'capt-jack-review',
            eventData: msg,
            blur: false,
          });
        } else if (
          msg.event_type ===
            'channel-channel_points_custom_reward_redemption-add' &&
          msg.event_data.reward.id === '99ef7c31-be4b-463f-8059-92c80f98ef32'
        ) {
          console.log('bring water!');
          this.eventQueue.push({
            overlay: 'bring-water',
            eventData: msg,
            blur: false,
          });
        } else if (
          msg.event_type ===
            'channel-channel_points_custom_reward_redemption-add' &&
          msg.event_data.reward.id === '4fd2137c-8dd6-411b-b406-a077ce017d0f'
        ) {
          console.log('calling behind you');
          this.eventQueue.push({
            overlay: 'behind-you',
            eventData: msg,
            blur: false,
          });
        } else if (
          msg.event_type ===
            'channel-channel_points_custom_reward_redemption-add' &&
          msg.event_data.reward.id === '7b9da1b1-eaab-4dea-afe0-cb361b36dd49'
        ) {
          console.log('write to matrix!');
          const message: EmoteMessage = {
            text: msg.event_data.user_input,
            emotes: msg.event_data.user_input_emotes,
          };
          this.writeToTheMatrix(message);
        } else if (msg.event_type === 'channel-subscription-message') {
          const username = msg.event_data.user_name;
          const extraData = await this.twitchEvents
            .getTwitchUserData(username)
            .toPromise();
          this.eventQueue.push({
            overlay: 'subscribe',
            eventData: msg,
            extraData,
            blur: true,
          });
        } else if (msg.event_type === 'channel-subscription-gift') {
          const username = msg.event_data.user_name;
          const extraData = await this.twitchEvents
            .getTwitchUserData(username)
            .toPromise();
          this.eventQueue.push({
            overlay: 'gift-subscription',
            eventData: msg,
            extraData,
            blur: true,
          });
        } else if (msg.event_type === 'channel-raid') {
          const extraData = await this.twitchEvents
            .getTwitchUserData(msg.event_data.from_broadcaster_user_name)
            .toPromise();
          this.eventQueue.push({
            overlay: 'raid',
            eventData: msg,
            extraData,
            blur: false,
          });
        }
        console.log(msg);
        if (this.eventQueue.length === 1) {
          this.obsCheckEventQueue(true);
        }
      })
    );
  }

  writeToTheMatrix(message: EmoteMessage) {
    console.log(message);
    const emotes = message.emotes
      ? message.emotes.reduce((acc, val) => {
          const currentEmotes = val.positions.map((emotePos) => ({
            id: val.id,
            position: emotePos,
          }));
          return [...acc, ...currentEmotes];
        }, [])
      : [];

    emotes.sort((a, b) => (a.position[0] < b.position[0] ? -1 : 1));

    const payload: MatrixMessageRow[] =
      emotes.length > 0
        ? emotes.reduce((acc, val, i) => {
            let current = [];
            if (i === 0 && val.position[0] > 0) {
              current.push({
                mc_type: 'string',
                value: message.text.substr(0, val.position[0]),
              });
            }
            current.push({
              mc_type: 'emote',
              value: val.id,
            });
            if (i < emotes.length - 1) {
              const nextStart = emotes[i + 1].position[0];
              const subStrLng = nextStart - val.position[1] - 1;
              current.push({
                mc_type: 'string',
                value: message.text.substr(val.position[1] + 1, subStrLng),
              });
            } else if (val.position[1] != message.text.length - 1) {
              current.push({
                mc_type: 'string',
                value: message.text.substr(val.position[1] + 1),
              });
            }
            return [...acc, ...current];
          }, [])
        : [
            {
              mc_type: 'string',
              value: message.text,
            },
          ];
    // console.log(payload);
    this.http.post('http://192.168.1.116:5000', payload).subscribe((resp) => {
      console.log(resp);
    });
  }

  async obsCheckEventQueue(originalEvent: boolean) {
    console.log('obsCheckEventQueue');
    if (originalEvent && this.eventQueue.length === 1) {
      const event = this.eventQueue[0];
      this.clearCurrentEvent();
      this.obsSceneToAlert(
        event.eventData,
        event.overlay,
        event.extraData,
        event.blur
      );
    } else if (!originalEvent && this.eventQueue.length > 0) {
      const event = this.eventQueue[0];
      this.clearCurrentEvent();
      this.obsAlert(
        event.eventData,
        event.overlay,
        event.extraData,
        event.blur
      );
    } else if (this.eventQueue.length === 0) {
      this.clearCurrentEvent();
    }
  }

  clearCurrentEvent() {
    this.currentMessage = null;
    this.currentOverlay = '';
    this.currentExtraData = null;
    this.cdr.detectChanges();
  }

  async obsSceneToAlert(
    msg: any,
    overlay: string,
    extraData: any,
    blur: boolean
  ) {
    while (
      this.currentScene$ === 'Starting Soon' ||
      this.currentScene$ === 'Chalk Boom'
    ) {
      console.log('waiting...');
      await new Promise((r) => setTimeout(r, 500));
    }
    this.obsWs.sendMessage({
      'request-type': 'TriggerHotkeyBySequence',
      ...stopAdvKeys,
      'message-id': '12345',
    });
    this.obs
      .send('GetCurrentScene')
      .then((data) => {
        this.currentScene = data.name;
      })
      .then(() => {
        this.obs.send('SetCurrentScene', {
          'scene-name': 'Alerts GS',
        });
        if (blur) {
          setTimeout(() => {
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
            this.obs.send('SetSourceFilterVisibility', {
              sourceName: 'Office BG GS',
              filterName: 'Sharp',
              filterEnabled: true,
            });
          }, 750);
        }

        setTimeout(() => {
          this.currentMessage = msg;
          this.currentOverlay = overlay;
          this.currentExtraData = extraData;
        }, 1500);
      });
  }

  obsAlert(msg: any, overlay: string, extraData: any, blur: boolean) {
    this.currentMessage = msg;
    this.currentOverlay = overlay;
    this.currentExtraData = extraData;
  }

  writingComplete() {
    this.eventQueue.shift();
    if (this.eventQueue.length > 0) {
      this.obsCheckEventQueue(false);
      return;
    } else {
      this.clearCurrentEvent();
    }
    this.obs.send('SetCurrentScene', {
      'scene-name': this.currentScene,
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
    this.obs.send('SetSourceFilterVisibility', {
      sourceName: 'Office BG GS',
      filterName: 'Blurry',
      filterEnabled: true,
    });
    this.obsWs.sendMessage({
      'request-type': 'TriggerHotkeyBySequence',
      ...startAdvKeys,
      'message-id': '54321',
    });
  }
}
