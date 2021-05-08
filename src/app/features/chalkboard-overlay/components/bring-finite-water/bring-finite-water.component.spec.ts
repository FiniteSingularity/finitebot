import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BringFiniteWaterComponent } from './bring-finite-water.component';

describe('BringFiniteWaterComponent', () => {
  let component: BringFiniteWaterComponent;
  let fixture: ComponentFixture<BringFiniteWaterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BringFiniteWaterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BringFiniteWaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
