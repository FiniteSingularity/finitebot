import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkboardOverlayComponent } from './chalkboard-overlay.component';

describe('ChalkboardOverlayComponent', () => {
  let component: ChalkboardOverlayComponent;
  let fixture: ComponentFixture<ChalkboardOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkboardOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkboardOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
