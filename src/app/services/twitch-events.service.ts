import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { retryWhen, delay } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

// Local TAU endpoint.  Token is tied to that instance of TAU.
// Should move this to an environment file.
const WS_ENDPOINT = 'ws://localhost:8005/ws/twitch-events/';
const token = '3e5c7c7f7535dcc0cc1206df5603208e3e26a100';

export interface TwitchEvent {
  overlay: string;
  eventData: any;
  extraData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TwitchEventsService {
  private webSocket: any = null;
  private message$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient
  ) {

  }

  get message(): Observable<any> {
    return this.message$.asObservable();
  }

  public connect(): void {
    if (!this.webSocket || this.webSocket.closed) {
      this.webSocket = this.getNewWebSocket();
      this.webSocket.pipe(
        // If we are disconnected, wait 2000ms before attempting to reconnect.
        retryWhen((err) => {
          console.log("Disconnected!  Attempting reconnection shortly...")
          return err.pipe(delay(2000));
        })
      ).subscribe(
        // Once we receieve a message from the server, pass it to the handler function.
        (msg: any) => {
          this.handler(msg);
        },
      );
    }
  }

  getNewWebSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log(`Connected to websocket at ${WS_ENDPOINT}`);
          this.sendMessage({ token });
        }
      },
    });
  }

  sendMessage(msg: any) {
    this.webSocket.next(msg);
  }

  close() {

  }

  handler(msg: any) {
    this.message$.next(msg);
  }

  getTwitchUserData(username: string) {
    const options = {
      headers: {
        Authorization: `Token ${token}`
      }
    };
    console.log(options);
    return this.http.get(
      `http://localhost:8005/api/v1/twitch-user/?login=${username}`,
      {
        headers: { Authorization: `Token ${token}` }
      }
    );
  }
}
