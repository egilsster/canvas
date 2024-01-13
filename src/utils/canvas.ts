import Circle from "../models/circle";
import Line from "../models/line";
import Pencil from "../models/pencil";
import Point from "../models/point";
import Rectangle from "../models/rectangle";
import Shape from "../models/shape";
import Text from "../models/text";
import { KEYS, getConfig, setKey } from "./config";

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
        this.currentShape = new Rectangle(
          x,
          y,
          this.penColor,
          this.penSize,
          x,
          y,
        );
        break;
      case "circle":
        this.currentShape = new Circle(x, y, this.penColor, this.penSize, x, y);
        break;
      case "text":
        this.displayTextBox(ev.clientX, ev.clientY);
        this.currentShape = new Text(
          ev.clientX - rect.left,
          ev.clientY - rect.top,
          this.penColor,
          "",
          this.penSize,
        );
        break;
      case "eraser":
        this.currentShape = new Pencil(x, y, "white", this.penSize);
        break;
    }
  }

  // Function that goes through
  // the saved array and remakes items
  // biome-ignore lint/suspicious/noExplicitAny: todo
  public drawLoaded(objects: any[]): void {
    for (const object of objects) {
      // TODO: Clean up switch statement so I dont
      // have to use the shape variable for casting
      // let shape: Shape;
      let start: Point;
      let end: Point;
      const points: Point[] = object.points;

      switch (object.type) {
        case "eraser":
        case "pencil": {
          start = object.position;
          const shape = new Pencil(
            start.x,
            start.y,
            object.color,
            object.lineWidth,
          );
          for (const point of points) {
            shape.addPoint(point.x, point.y);
          }
          this.shapes.push(shape);
          break;
        }
        case "line": {
          start = object.position;
          end = object.endPoint;
          const shape = new Line(
            start.x,
            start.y,
            object.color,
            object.lineWidth,
            end.x,
            end.y,
          );
          this.shapes.push(shape);
          break;
        }
        case "rectangle": {
          start = object.position;
          const shape = new Rectangle(
            start.x,
            start.y,
            object.color,
            object.size,
            object.width,
            object.height,
          );
          this.shapes.push(shape);
          break;
        }
        case "circle": {
          start = object.position;
          end = object.endPoint;
          const shape = new Circle(
            start.x,
            start.y,
            object.color,
            object.lineWidth,
            end.x,
            end.y,
          );
          this.shapes.push(shape);
          break;
        }
        case "text": {
          console.log("text case");

          start = object.position;
          const shape = new Text(
            start.x,
            start.y,
            object.color,
            object.fontSize,
            object.text,
          );
          this.shapes.push(shape);
          break;
        }
      }
    }

    this.redraw();
  }

  public redraw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const shape of this.shapes) {
      shape.draw(this.ctx);
    }
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
    // Coordinates minus roughly the height on the input
    // so it's placed directly under the cursor.
    this.currentInputBox.style.top = `${y - 10}px`;
    this.currentInputBox.style.left = `${x - 10}px`;
    this.currentInputBox.className =
      "top-[100px] fixed border border-black rounded-sm p-1";

    document.querySelector(".text-spawner")?.append(this.currentInputBox);
    this.currentInputBox.focus();
  }
}
