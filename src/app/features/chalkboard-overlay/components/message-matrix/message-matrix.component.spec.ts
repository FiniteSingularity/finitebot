import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageMatrixComponent } from './message-matrix.component';

describe('MessageMatrixComponent', () => {
  let component: MessageMatrixComponent;
  let fixture: ComponentFixture<MessageMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
