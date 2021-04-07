import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, retryWhen } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

const OBSWS_ENDPOINT = 'ws://localhost:4444/';


export const startAdvKeys = {
  keyId: 'OBS_KEY_1',
  keyModifiers: {
    shift: true,
    alt: true,
    control: true,
    command: false,
  }
};
export const stopAdvKeys = {
  keyId: 'OBS_KEY_2',
  keyModifiers: {
    shift: true,
    alt: true,
    control: true,
    command: false,
  }
};

@Injectable({
  providedIn: 'root'
})
export class ObsWebsocketsService {
  private webSocket: any = null;
  private message$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
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
        url: OBSWS_ENDPOINT,
        openObserver: {
            next: () => {
                console.log(`Connected to websocket at ${OBSWS_ENDPOINT}`);
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
}
