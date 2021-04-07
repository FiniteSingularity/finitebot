import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkboardRaidComponent } from './chalkboard-raid.component';

describe('ChalkboardRaidComponent', () => {
  let component: ChalkboardRaidComponent;
  let fixture: ComponentFixture<ChalkboardRaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkboardRaidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkboardRaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
