import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkboardCheerComponent } from './chalkboard-cheer.component';

describe('ChalkboardCheerComponent', () => {
  let component: ChalkboardCheerComponent;
  let fixture: ComponentFixture<ChalkboardCheerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkboardCheerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkboardCheerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
