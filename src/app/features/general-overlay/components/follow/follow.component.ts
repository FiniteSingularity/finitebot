import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss']
})
export class FollowComponent implements OnInit {
  @Input() msg: any;
  @Output() displayComplete = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.displayComplete.emit();
    }, 4000);
  }

}
