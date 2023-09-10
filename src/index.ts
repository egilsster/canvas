import Picker from "vanilla-picker";
import Circle from "./models/circle";
import Line from "./models/line";
import Pencil from "./models/pencil";
import Rectangle from "./models/rectangle";
import Text from "./models/text";
import "./style.css";
import Canvas from "./utils/canvas";
import { getConfig } from "./utils/config";
import ResizeCanvas from "./utils/resizer";

(() => {
  const penShapeElement = document.querySelector(
    "#penShape",
  ) as HTMLSelectElement;
  const penSizeElement = document.querySelector(
    "#penSize",
  ) as HTMLSelectElement;
  const penColorElement = document.querySelector(
    "#penColor",
  ) as HTMLSelectElement;
  const canvasElement = document.querySelector(
    "#my-canvas",
  ) as HTMLCanvasElement;

  const config = getConfig();

  penShapeElement.value = config.penShape;
  penSizeElement.value = String(config.penSize);

  // Resize the whiteboard to match width and height of window
  ResizeCanvas(canvasElement);
  window.addEventListener("resize", () => ResizeCanvas(canvasElement));

  const canvas: Canvas = new Canvas(canvasElement);

  penColorElement.style.background = config.penColor;
  new Picker({
    parent: penColorElement,
    color: config.penColor,
    onDone: function (color) {
      penColorElement.style.background = color.hex;
      canvas.penColor = color.hex;
    },
  });

  penShapeElement.addEventListener("change", (ev) => {
    const target = ev.target as HTMLSelectElement | null;
    canvas.penShape = target?.value || canvas.penShape;
  });

  penSizeElement.addEventListener("change", (ev) => {
    const target = ev.target as HTMLSelectElement | null;
    canvas.penSize = Number(target?.value) || canvas.penSize;
  });

  document
    .querySelector("#clear-canvas")
    ?.addEventListener("click", () => canvas.clearCanvas());
  document
    .querySelector("#undo")
    ?.addEventListener("click", () => canvas.redoShape());
  document
    .querySelector("#redo")
    ?.addEventListener("click", () => canvas.undoShape());

  canvasElement.addEventListener("mousedown", (ev): void => {
    const target = ev.target as HTMLCanvasElement | null;
    if (target) {
      const x0 = ev.pageX - target.offsetLeft;
      const y0 = ev.pageY - target.offsetTop;
      canvas.addShape(x0, y0, ev);
    }
  });

  canvasElement.addEventListener("mousemove", (ev): void => {
    const target = ev.target as HTMLCanvasElement | null;
    if (canvas.isDrawing && target) {
      const x0 = ev.pageX - target.offsetLeft;
      const y0 = ev.pageY - target.offsetTop;
      const width = x0 - canvas.currentShape.position.x;
      const height = y0 - canvas.currentShape.position.y;

      switch (canvas.penShape) {
        case "pencil":
          (canvas.currentShape as Pencil).addPoint(x0, y0);
          break;
        case "line":
          (canvas.currentShape as Line).setEndPoint(x0, y0);
          break;
        case "rectangle":
          (canvas.currentShape as Rectangle).setSize(width, height);
          break;
        case "circle":
          (canvas.currentShape as Circle).setSize(x0, y0);
          break;
        case "eraser":
          (canvas.currentShape as Pencil).addPoint(x0, y0);
          break;
      }

      // Draw shape while mouse is moving
      canvas.redraw();
      canvas.currentShape.draw(canvas.ctx);
    }
  });

  canvasElement.addEventListener("mouseup", (): void => {
    if (canvas.penShape !== "text") {
      canvas.shapes.push(canvas.currentShape);
      canvas.redraw();
    }

    canvas.isDrawing = false;
  });

  (
    document.querySelector(".text-spawner") as HTMLTextAreaElement
  ).addEventListener("keydown", (ev): void => {
    if (canvas.isDrawing) {
      if (ev.which === 13) {
        const currShape = canvas.currentShape as Text;
        currShape.setText = canvas.currentInputBox.value;

        canvas.shapes.push(canvas.currentShape);
        canvas.currentShape.draw(canvas.ctx);

        canvas.isDrawing = false;
        canvas.currentInputBox.remove();
      } else if (ev.which === 27) {
        canvas.isDrawing = false;
        canvas.currentInputBox.remove();
      }
    }
  });
})();
