import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkBoomOverlayComponent } from './chalk-boom-overlay.component';

describe('ChalkBoomOverlayComponent', () => {
  let component: ChalkBoomOverlayComponent;
  let fixture: ComponentFixture<ChalkBoomOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkBoomOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkBoomOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
