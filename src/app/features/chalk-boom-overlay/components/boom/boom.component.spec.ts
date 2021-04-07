import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoomComponent } from './boom.component';

describe('BoomComponent', () => {
  let component: BoomComponent;
  let fixture: ComponentFixture<BoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
