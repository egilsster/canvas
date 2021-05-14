import Shape from "./shape";

export default class Text extends Shape {
  public type = "text";

  constructor(
    x: number,
    y: number,
    color: string,
    private text: string,
    public fontSize: number
  ) {
    super(x, y, color);
  }

  public set setText(text: string) {
    this.text = text;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.fontSize * 5 + "px Arial";
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.position.x, this.position.y);
  }
}
