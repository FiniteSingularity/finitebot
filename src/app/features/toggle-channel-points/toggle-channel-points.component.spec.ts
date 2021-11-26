import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleChannelPointsComponent } from './toggle-channel-points.component';

describe('ToggleChannelPointsComponent', () => {
  let component: ToggleChannelPointsComponent;
  let fixture: ComponentFixture<ToggleChannelPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleChannelPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleChannelPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
