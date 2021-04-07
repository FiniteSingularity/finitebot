import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Point } from 'src/app/models/point';

@Component({
  selector: 'app-boom',
  templateUrl: './boom.component.html',
  styleUrls: ['./boom.component.scss'],
})
export class BoomComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() position: Point = { x: 0, y: 0 };
  @Input() color: string = '#FFFFFF';
  @Input() zIndex: number = 0;
  @Input() progress: number = 0;
  @Input() maxRadius: number = 24;
  @Input() boomRate: number = 15;
  @Output() currentRadius = new EventEmitter<number>();

  maxBoomRadius = 0;
  boom = false;
  radius = 0;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if ('maxRadius' in simpleChanges && simpleChanges.maxRadius.firstChange) {
      this.maxBoomRadius = this.maxRadius;
    }
    this.setBoomRadius();
  }

  ngAfterViewInit(): void {
    this.boom = true;
  }

  setBoomRadius(): void {
    if (this.progress && this.boomRate && this.maxBoomRadius) {
      const boomIncrement = (this.progress / 1000.0 * this.boomRate);
      this.radius = Math.min(
        this.radius + boomIncrement,
        this.maxRadius
      );
      this.currentRadius.emit(this.radius);
    }
  }

}
