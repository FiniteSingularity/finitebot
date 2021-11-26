import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehindYouComponent } from './behind-you.component';

describe('BehindYouComponent', () => {
  let component: BehindYouComponent;
  let fixture: ComponentFixture<BehindYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehindYouComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehindYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
