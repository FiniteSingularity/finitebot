import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptJackReviewComponent } from './capt-jack-review.component';

describe('CaptJackReviewComponent', () => {
  let component: CaptJackReviewComponent;
  let fixture: ComponentFixture<CaptJackReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptJackReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptJackReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
