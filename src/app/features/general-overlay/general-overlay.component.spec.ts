import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralOverlayComponent } from './general-overlay.component';

describe('GeneralOverlayComponent', () => {
  let component: GeneralOverlayComponent;
  let fixture: ComponentFixture<GeneralOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
