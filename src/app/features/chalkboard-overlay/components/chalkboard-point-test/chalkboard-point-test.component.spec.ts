import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkboardPointTestComponent } from './chalkboard-point-test.component';

describe('ChalkboardPointTestComponent', () => {
  let component: ChalkboardPointTestComponent;
  let fixture: ComponentFixture<ChalkboardPointTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkboardPointTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkboardPointTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
