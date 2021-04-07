import { TestBed } from '@angular/core/testing';

import { ChalkBoomService } from './chalk-boom.service';

describe('ChalkBoomService', () => {
  let service: ChalkBoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChalkBoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
