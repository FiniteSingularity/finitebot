import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Input() gameTime = 0;
  @Input() timeElapsed = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
