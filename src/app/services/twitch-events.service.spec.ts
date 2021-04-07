import { TestBed } from '@angular/core/testing';

import { TwitchEventsService } from './twitch-events.service';

describe('TwitchEventsService', () => {
  let service: TwitchEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitchEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
