import Point from "./point";

export default abstract class Shape {
  readonly position: Point;

  constructor(
    x: number,
    y: number,
    public color: string,
  ) {
    this.position = new Point(x, y);
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
}
