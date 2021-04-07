import { Point } from "./point";

export interface BoundingBox {
    minBound: Point; // Upper Left Corner
    maxBound: Point; // Lower Right Corner.
}
