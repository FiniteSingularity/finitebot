import { TestBed } from '@angular/core/testing';

import { CheerComponentService } from './cheer-component.service';

describe('CheerComponentService', () => {
  let service: CheerComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheerComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
