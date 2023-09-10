import Point from "./point";
import Shape from "./shape";

export default class Line extends Shape {
  public type = "line";
  private endPoint: Point;

  constructor(
    x0: number,
    y0: number,
    color: string,
    public lineWidth: number,
    x1: number,
    y1: number,
  ) {
    super(x0, y0, color);
    this.endPoint = new Point(x1, y1);
  }

  setEndPoint(x: number, y: number): void {
    this.endPoint.x = x;
    this.endPoint.y = y;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineCap = "round";
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.endPoint.x, this.endPoint.y);

    ctx.strokeStyle = this.color;
    ctx.stroke();
  }
}
