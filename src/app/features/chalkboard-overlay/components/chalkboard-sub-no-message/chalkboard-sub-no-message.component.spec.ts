import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChalkboardSubNoMessageComponent } from './chalkboard-sub-no-message.component';

describe('ChalkboardSubNoMessageComponent', () => {
  let component: ChalkboardSubNoMessageComponent;
  let fixture: ComponentFixture<ChalkboardSubNoMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChalkboardSubNoMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChalkboardSubNoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
