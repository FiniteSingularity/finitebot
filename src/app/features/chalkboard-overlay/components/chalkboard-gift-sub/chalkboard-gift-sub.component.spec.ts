import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkboardGiftSubComponent } from './chalkboard-gift-sub.component';

describe('ChalkboardGiftSubComponent', () => {
  let component: ChalkboardGiftSubComponent;
  let fixture: ComponentFixture<ChalkboardGiftSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkboardGiftSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkboardGiftSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
