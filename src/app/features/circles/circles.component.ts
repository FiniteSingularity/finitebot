import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as paper from 'paper';

// Algorthm idea for common overlap from:
// https://github.com/benfred/bens-blog-code/blob/master/circle-intersection/circle-intersection.js

const SMALL = 1e-10;

interface CircleData {
  x: number;
  y: number;
  r: number;
  color: [number, number, number];
}

interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: [number, number, number];
}

interface Point {
  x: number;
  y: number;
}

interface IndexedPoint {
  point: Point;
  angle: number;
  parents: CircleData[];
}

@Component({
  selector: 'app-circles',
  templateUrl: './circles.component.html',
  styleUrls: ['./circles.component.scss']
})
export class CirclesComponent implements OnInit, AfterViewInit {
  primaryCircle: CircleData = {
    x: 500,
    y: 400,
    r: 200,
    color: [0, 0, 200]
  };

  coverCircles: CircleData[] = [
    {
      x: 600,
      y: 505,
      r: 150,
      color: [200, 0, 0]
    },
    {
      x: 650,
      y: 400,
      r: 125,
      color: [200, 0, 0]
    },
    {
      x: 700,
      y: 450,
      r: 150,
      color: [200, 0, 0]
    }
  ]

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.drawCircles();
  }

  setupCanvas() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    paper.setup(canvas);
    // paper.project.view.viewSize = new paper.Size(600, 600);
  }

  calculateAllOverlap() {

    const c1Overlaps = this.coverCircles.map((c2) => {
      return this.overlapArea(this.primaryCircle, c2)
    })
  }

  drawCircles() {
    const primary = this.drawCircle(this.primaryCircle);
    this.coverCircles.forEach(data => this.drawCircle(data));

    this.calculateAllOverlap();
    const area = this.intersectionArea([this.primaryCircle, ...this.coverCircles]);
    console.log(area);
  }

  drawCircle(data: CircleData) {
    const circle = new paper.Path.Circle(
      new paper.Point(data.x, data.y),
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

  drawLine(data: LineData) {
    const line = new paper.Path.Line(
      new paper.Point(data.x1, data.y1),
      new paper.Point(data.x2, data.y2)
    );
    line.strokeColor = new paper.Color(
      ...data.color, 1.0
    );
    return line;
  }

  distance(c1: CircleData, c2: CircleData): number {
    return this.dist({ x: c1.x, y: c1.y }, { x: c2.x, y: c2.y });
  }

  dist(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }

  dist2(p1: Point, p2: Point): number {
    return (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
  }

  overlapping(c1: CircleData, c2: CircleData): boolean {
    return this.distance(c1, c2) < c1.r + c2.r;
  }

  overlapArea(c1: CircleData, c2: CircleData): number {
    const c1c2 = this.dist2(
      { x: c1.x, y: c1.y }, { x: c2.x, y: c2.y }
    );

    const c1c2d = this.dist(
      { x: c1.x, y: c1.y }, { x: c2.x, y: c2.y }
    )

    if (c1c2d + c2.r <= (c1.r)) {
      return this.circleArea(c2);
    }

    const intersection = this.intersectionPoints(c1, c2);
    const cl = this.dist(intersection[0], intersection[1]);
    const intMid = {
      x: (intersection[0].x + intersection[1].x) / 2.0,
      y: (intersection[0].y + intersection[1].y) / 2.0,
    }



    const c1Mid = this.dist2(
      { x: c1.x, y: c1.y }, intMid
    );

    const c2Mid = this.dist2(
      { x: c2.x, y: c2.y }, intMid
    )

    const c1Segment = c1c2 > c2Mid;

    const c2Segment = c1c2 > c1Mid;

    const c1LensArea = c1Segment ?
      this.segmentArea(c1, cl) :
      this.circleArea(c1) - this.segmentArea(c1, cl);

    const c2LensArea = c2Segment ?
      this.segmentArea(c2, cl) :
      this.circleArea(c2) - this.segmentArea(c2, cl);

    return c1LensArea + c2LensArea;
  }

  circleArea(cir: CircleData): number {
    return Math.PI * cir.r ** 2;
  }

  segmentArea(cir: CircleData, cl: number): number {
    const alpha = 2.0 * Math.asin(cl / (2 * cir.r));
    return 0.5 * cir.r ** 2 * (alpha - Math.sin(alpha));
  }

  intersectionPoints(c1: CircleData, c2: CircleData): Point[] {
    const D = this.distance(c1, c2);

    if ((D >= (c1.r + c2.r)) || (D <= Math.abs(c1.r - c2.r))) {
      return [];
    }

    const delta = 0.25 * Math.sqrt(
      (D + c1.r + c2.r) * (D + c1.r - c2.r) * (D - c1.r + c2.r) * (-D + c1.r + c2.r)
    );

    const Xc = (c1.x + c2.x) / 2 + (c2.x - c1.x) *
      (Math.pow(c1.r, 2) - Math.pow(c2.r, 2)) / (2 * D * D);

    const Yc = (c1.y + c2.y) / 2 + (c2.y - c1.y) *
      (Math.pow(c1.r, 2) - Math.pow(c2.r, 2)) / (2 * D * D);

    return [
      {
        x: Xc + 2 * (c1.y - c2.y) / (D * D) * delta,
        y: Yc - 2 * (c1.x - c2.x) / (D * D) * delta,
      },
      {
        x: Xc - 2 * (c1.y - c2.y) / (D * D) * delta,
        y: Yc + 2 * (c1.x - c2.x) / (D * D) * delta,
      }];
  }

  intersectionArea(circles: CircleData[]) {
    const intersectionPoints = this.getIntersectionPoints(circles);
    intersectionPoints.forEach((point: IndexedPoint) => {
      this.drawCircle({
        x: point.point.x,
        y: point.point.y,
        r: 3,
        color: [0, 0, 200]
      });
    })

    const innerPoints = intersectionPoints.filter(p => this.containedInCircles(p, circles));

    innerPoints.forEach((point: IndexedPoint) => {
      this.drawCircle({
        x: point.point.x,
        y: point.point.y,
        r: 3,
        color: [200, 0, 0]
      });
    })

    let arcArea = 0, polygonArea = 0, arcs = [], i: number;

    if (innerPoints.length > 1) {
      const center = this.getCenter(innerPoints);
      innerPoints.forEach(point => {
        point.angle = Math.atan2(point.point.x - center.x, point.point.y - center.y);
      })

      innerPoints.sort(function (a, b) { return b.angle - a.angle; });
      let p2 = innerPoints[innerPoints.length - 1];
      innerPoints.forEach(p1 => {
        // polygon area updates easily ...
        polygonArea += (p2.point.x + p1.point.x) * (p1.point.y - p2.point.y);

        // updating the arc area is a little more involved
        const midPoint = {
          x: (p1.point.x + p2.point.x) / 2,
          y: (p1.point.y + p2.point.y) / 2
        };
        let arc = null;

        p1.parents.forEach(p1p => {
          // if (p2.parentIndex.indexOf(p1.parentIndex[j]) > -1) {
          if (p2.parents.findIndex(
            p2p => p2p.x === p1p.x && p2p.y === p1p.y && p2p.r === p1p.r
          ) > -1
          ) {
            // figure out the angle halfway between the two points
            // on the current circle
            const a1 = Math.atan2(p1.point.x - p1p.x, p1.point.y - p1p.y);
            const a2 = Math.atan2(p2.point.x - p1p.x, p2.point.y - p1p.y);

            var angleDiff = (a2 - a1);
            if (angleDiff < 0) {
              angleDiff += 2 * Math.PI;
            }

            // and use that angle to figure out the width of the
            // arc
            var a = a2 - angleDiff / 2,
              width = this.dist(midPoint, {
                x: p1p.x + p1p.r * Math.sin(a),
                y: p1p.y + p1p.r * Math.cos(a)
              });

            // pick the circle whose arc has the smallest width
            if ((arc === null) || (arc.width > width)) {
              arc = {
                circle: p1p,
                width: width,
                p1: p1,
                p2: p2
              };
            }
          }
        });
        arcs.push(arc);
        arcArea += this.circleAreaWidth(arc.circle.r, arc.width);
        p2 = p1;
      });
    } else {
      // no intersection points, is either disjoint - or is completely
      // overlapped. figure out which by examining the smallest circle
      const smallest = circles.reduce((prev, curr) => {
        return prev.r < curr.r ? prev : curr;
      });

      // make sure the smallest circle is completely contained in all
      // the other circles
      let disjoint = false;
      for (i = 0; i < circles.length; ++i) {
        const circle = circles[i];
        const dist = this.dist({ x: circle.x, y: circle.y }, { x: smallest.x, y: smallest.y });
        if (dist > Math.abs(smallest.r - circle.r)) {
          disjoint = true;
          break;
        }
      }

      if (disjoint) {
        arcArea = polygonArea = 0;

      } else {
        arcArea = smallest.r * smallest.r * Math.PI;
        arcs.push({
          circle: smallest,
          p1: { x: smallest.x, y: smallest.y + smallest.r },
          p2: { x: smallest.x - SMALL, y: smallest.y + smallest.r },
          width: smallest.r * 2
        });
      }
    }
    polygonArea /= 2;

    return arcArea + polygonArea;
  }

  getIntersectionPoints(circles: CircleData[]) {
    const ret: IndexedPoint[] = [];

    circles.forEach((c1, i) => {
      circles.slice(i + 1).forEach((c2, j) => {
        const intersect = this.intersectionPoints(c1, c2);
        intersect.forEach(point => {
          ret.push({
            point,
            angle: 0,
            parents: [c1, c2]
          });
        });
      });
    });
    return ret;
  }

  containedInCircles(point: IndexedPoint, circles: CircleData[]) {

    for (let i = 0; i < circles.length; ++i) {
      if (this.dist2(point.point, circles[i]) > (circles[i].r + SMALL) ** 2) {
        return false;
      }
    }
    return true;
  }

  getCenter(points: IndexedPoint[]): Point {
    const center: Point = { x: 0, y: 0 };
    points.forEach(point => {
      center.x += point.point.x,
        center.y += point.point.y
    });
    center.x /= points.length;
    center.y /= points.length;
    return center;
  }

  circleIntegral(r: number, x: number): number {
    var y = Math.sqrt(r * r - x * x);
    return x * y + r * r * Math.atan2(x, y);
  };

  /** Returns the area of a circle of radius r - up to width */
  circleAreaWidth(r: number, width: number): number {
    return this.circleIntegral(r, width - r) - this.circleIntegral(r, -r);
  };

}
