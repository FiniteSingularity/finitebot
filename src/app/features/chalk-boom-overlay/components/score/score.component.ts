import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit, OnChanges {
  @Input() scores: {[key: string]: number} = {};
  keys: string[] = [];
  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.keys = Object.keys(this.scores);
  }

}
