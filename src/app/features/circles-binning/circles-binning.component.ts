import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as paper from 'paper';

import { Circle } from '../../models/circle';
import { BoundingBox } from '../../models/bounding-box';

@Component({
  selector: 'app-circles-binning',
  templateUrl: './circles-binning.component.html',
  styleUrls: ['./circles-binning.component.scss']
})
export class CirclesBinningComponent implements OnInit, AfterViewInit {
  primaryCircle: Circle = {
    center: { x: 500, y: 400 },
    r: 200,
    color: [0, 0, 200]
  };

  coverCircles: Circle[] = [
    {
      center: { x: 600, y: 505 },
      r: 150,
      color: [200, 0, 0]
    },
    {
      center: { x: 800, y: 400 },
      r: 125,
      color: [200, 0, 0]
    },
    {
      center: { x: 700, y: 250 },
      r: 150,
      color: [200, 0, 0]
    },
    {
      center: { x: 300, y: 400 },
      r: 300,
      color: [200, 0, 0]
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit');
    this.setupCanvas();
    this.drawCircles();

    this.coverCircles = this.coverCircles.sort((a, b) => {
      return a.center.y > b.center.y ? 1 : 1;
    });

    const area = this.calculateArea(this.primaryCircle);
    const estimate = this.estimateArea(this.primaryCircle, 2);
    const error = (estimate - area) / area;
    console.log(area, estimate, error);
    const compoundArea = this.estimateCompoundArea(this.primaryCircle, this.coverCircles, 1);
    console.log(compoundArea);
  }

  setupCanvas() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    paper.setup(canvas);
  }

  drawCircles() {
    const primary = this.drawCircle(this.primaryCircle);
    this.coverCircles.forEach(data => this.drawCircle(data));
    this.drawBoundingBox(this.getBoundingBox(this.primaryCircle));
    this.coverCircles.forEach(data => this.drawBoundingBox(this.getBoundingBox(data)));
  }

  drawBoundingBox(data: BoundingBox) {
    const bb = new paper.Path.Rectangle(
      new paper.Point(data.minBound.x, data.minBound.y),
      new paper.Point(data.maxBound.x, data.maxBound.y),
    );
    bb.strokeColor = new paper.Color(
      0, 0, 0, 1.0
    );
  }

  drawCircle(data: Circle) {
    const circle = new paper.Path.Circle(
      new paper.Point(data.center.x, data.center.y),
      data.r
    );
    circle.strokeColor = new paper.Color(
      ...data.color, 1.0
    );
    circle.fillColor = new paper.Color(
      ...data.color, 0.3
    )
    return circle;
  }

  getBoundingBox(circle: Circle): BoundingBox {
    return {
      minBound: { x: circle.center.x - circle.r, y: circle.center.y - circle.r },
      maxBound: { x: circle.center.x + circle.r, y: circle.center.y + circle.r }
    };
  }

  calculateArea(circle: Circle): number {
    return Math.PI * circle.r ** 2;
  }

  estimateArea(circle: Circle, binSize = 1): number {
    const bb = this.getBoundingBox(circle);
    let area = 0;
    for (let y = bb.minBound.y; y <= bb.maxBound.y; y += binSize) {
      const c = Math.sqrt(circle.r ** 2 - (y - circle.center.y) ** 2)
      const xMin = circle.center.x - c;
      const xMax = circle.center.x + c;
      area += (xMax - xMin) * binSize;
    }
    return area;
  }

  estimateCompoundArea(circle: Circle, overlapCircles: Circle[], binSize = 1): number {
    let area = 0
    const bb = this.getBoundingBox(circle);

    for (let y = bb.minBound.y; y <= bb.maxBound.y; y += binSize) {
      let checked = false;
      let cBounds = this.scanLineBounds(circle, y);
      let scanLineArea = (cBounds.xMax - cBounds.xMin) * binSize;

      const scanLineOverlap = overlapCircles.filter(c => {
        return (c.center.y - c.r <= y) && (c.center.y + c.r >= y)
      });
      let overlapBounds: { xMin: number, xMax: number }[] = [];
      scanLineOverlap.forEach(slo => {
        const bounds = this.scanLineBounds(slo, y);
        if (bounds.xMin < cBounds.xMax && bounds.xMax > cBounds.xMin) {
          bounds.xMin = Math.max(bounds.xMin, cBounds.xMin);
          bounds.xMax = Math.min(bounds.xMax, cBounds.xMax);
          overlapBounds.push({ ...bounds });
        }
      });
      overlapBounds = overlapBounds.sort((a, b) => a.xMin < b.xMin ? -1 : 1);

      const constrainedBounds = [];
      overlapBounds.forEach((bounds) => {
        const length = constrainedBounds.length;
        if (length === 0) {
          constrainedBounds.push({ ...bounds });
        } else if (bounds.xMin <= constrainedBounds[length - 1].xMax) {
          constrainedBounds[length - 1].xMax = bounds.xMax
        } else {
          constrainedBounds.push({ ...bounds });
        }
      });
      constrainedBounds.forEach(bounds => {
        scanLineArea -= (bounds.xMax - bounds.xMin);
      })
      area += scanLineArea;
    }

    return area;
  }

  scanLineBounds(circle: Circle, y: number) {
    const c = Math.sqrt(circle.r ** 2 - (y - circle.center.y) ** 2)
    const xMin = circle.center.x - c;
    const xMax = circle.center.x + c;
    return { xMin, xMax };
  }

}
