import Shape from './shape';

export default class Rectangle extends Shape {
  public type = 'rectangle';

  constructor(x: number, y: number, color: string, public size: number, public width: number, public height: number) {
    super(x, y, color);
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
  }
}
