import { TestBed } from '@angular/core/testing';

import { ObsWebsocketsService } from './obs-websockets.service';

describe('ObsWebsocketsService', () => {
  let service: ObsWebsocketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObsWebsocketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
