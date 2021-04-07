import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclesBinningComponent } from './circles-binning.component';

describe('CirclesBinningComponent', () => {
  let component: CirclesBinningComponent;
  let fixture: ComponentFixture<CirclesBinningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CirclesBinningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirclesBinningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
