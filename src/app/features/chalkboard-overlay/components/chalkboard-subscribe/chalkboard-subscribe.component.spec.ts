import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkboardSubscribeComponent } from './chalkboard-subscribe.component';

describe('ChalkboardSubscribeComponent', () => {
  let component: ChalkboardSubscribeComponent;
  let fixture: ComponentFixture<ChalkboardSubscribeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkboardSubscribeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkboardSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
