import { getConfig, KEYS, setKey } from "./config";
import Pencil from "../models/pencil";
import Line from "../models/line";
import Rectangle from "../models/rectangle";
import Circle from "../models/circle";
import Text from "../models/text";
import Shape from "../models/shape";
import Point from "../models/point";

export default class Canvas {
  public ctx: CanvasRenderingContext2D;
  public currentInputBox!: HTMLInputElement;
  public currentShape!: Shape;
  public shapes: Shape[] = [];
  public undoObjects: Shape[] = [];
  public isDrawing = false;
  private _penColor = "#000";
  private _penShape = "pencil";
  private _penSize = 4;

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d") || new CanvasRenderingContext2D();

    const config = getConfig();
    if (config) {
      this.penColor = config.penColor;
      this.penShape = config.penShape;
      this.penSize = config.penSize;
    }
  }

  public get penShape(): string {
    return this._penShape;
  }

  public set penShape(shape: string) {
    this._penShape = shape;
    setKey(KEYS.penShape, shape);
  }

  public get penColor(): string {
    return this._penColor;
  }

  public set penColor(color: string) {
    this._penColor = color;
    setKey(KEYS.penColor, color);
  }

  public get penSize(): number {
    return this._penSize;
  }

  public set penSize(size: number) {
    this._penSize = size;
    setKey(KEYS.penSize, String(size));
  }

  public addShape(x: number, y: number, ev: MouseEvent): void {
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();

    switch (this.penShape) {
      case "pencil":
        this.currentShape = new Pencil(x, y, this.penColor, this.penSize);
        break;
      case "line":
        this.currentShape = new Line(x, y, this.penColor, this.penSize, x, y);
        break;
      case "rectangle":
        this.currentShape = new Rectangle(x, y, this.penColor, this.penSize, x, y);
        break;
      case "circle":
        this.currentShape = new Circle(x, y, this.penColor, this.penSize, x, y);
        break;
      case "text":
        this.displayTextBox(ev.clientX, ev.clientY);
        this.currentShape = new Text(ev.clientX - rect.left, ev.clientY - rect.top, this.penColor, "", this.penSize);
        break;
      case "eraser":
        this.currentShape = new Pencil(x, y, "white", this.penSize);
        break;
    }
  }

  // Function that goes through
  // the saved array and remakes items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public drawLoaded(objects: any[]): void {
    objects.forEach((object) => {
      // TODO: Clean up switch statement so I dont
      // have to use the shape variable for casting
      let shape, start: Point, end: Point;
      const points: Point[] = object.points;

      switch (object.type) {
        case "eraser":
        case "pencil":
          start = object.position;
          shape = new Pencil(start.x, start.y, object.color, object.lineWidth);
          points.forEach((point) => shape.addPoint(point.x, point.y));
          break;
        case "line":
          start = object.position;
          end = object.endPoint;
          shape = new Line(start.x, start.y, object.color, object.lineWidth, end.x, end.y);
          break;
        case "rectangle":
          start = object.position;
          shape = new Rectangle(start.x, start.y, object.color, object.size, object.width, object.height);
          break;
        case "circle":
          start = object.position;
          end = object.endPoint;
          shape = new Circle(start.x, start.y, object.color, object.lineWidth, end.x, end.y);
          break;
        case "text":
          start = object.position;
          shape = new Text(start.x, start.y, object.color, object.fontSize, object.text);
          break;
      }

      this.shapes.push(shape);
    });

    this.redraw();
  }

  public redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.shapes.forEach((shape) => shape.draw(this.ctx));
  }

  public clearCanvas(): void {
    this.shapes = [];
    this.redraw();
  }

  public undoShape(): void {
    if (this.undoObjects.length > 0) {
      const obj = this.undoObjects.pop();
      if (obj) {
        this.shapes.push(obj);
      }
      this.redraw();
    }
  }

  public redoShape(): void {
    if (this.shapes.length > 0) {
      const obj = this.shapes.pop();
      if (obj) {
        this.undoObjects.push(obj);
      }
      this.redraw();
    }
  }

  // Displays the hidden text field for Text shape
  private displayTextBox(x: number, y: number): void {
    if (this.currentInputBox) {
      this.currentInputBox.remove();
    }

    this.currentInputBox = document.createElement("input");
    this.currentInputBox.style.position = "fixed";
    this.currentInputBox.style.top = `${y}px`;
    this.currentInputBox.style.left = `${x}px`;

    document.querySelector(".text-spawner")?.append(this.currentInputBox);
    this.currentInputBox.focus();
  }
}
