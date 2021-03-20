import $ from "jquery";

import "spectrum-colorpicker/spectrum.css";
import "spectrum-colorpicker";
import "./style.css";

import ResizeCanvas from "./utils/resizer";
import Canvas from "./utils/canvas";
import Pencil from "./models/pencil";
import Line from "./models/line";
import Rectangle from "./models/rectangle";
import Circle from "./models/circle";
import Text from "./models/text";

$(() => {
  // Resize the whiteboard to match width and height of window
  ResizeCanvas();
  $(window).on("resize", ResizeCanvas);

  const canvasElement = document.getElementById("my-canvas") as HTMLCanvasElement;
  const canvas: Canvas = new Canvas(canvasElement);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colorPicker = $("#penColor") as any;
  colorPicker.spectrum({
    preferredFormat: "hex",
  });

  $("#pen-shape").on("change", (ev: JQuery.EventBase): void => {
    canvas.penShape = ev.target["value"];
  });

  $("#penSize").on("change", (ev: JQuery.EventBase): void => {
    canvas.penSize = ev.target["value"];
  });

  $("#penColor").on("change", (ev: JQuery.EventBase): void => {
    canvas.penColor = ev.target["value"];
  });

  $("#clear-canvas").on("click", (): void => canvas.clearCanvas());
  $("#undo").on("click", (): void => canvas.redoShape());
  $("#redo").on("click", (): void => canvas.undoShape());

  $("#my-canvas").mousedown((ev: JQuery.MouseDownEvent): void => {
    const x0 = ev.pageX - ev.target["offsetLeft"];
    const y0 = ev.pageY - ev.target["offsetTop"];
    canvas.addShape(x0, y0, ev);
  });

  $("#my-canvas").mousemove((ev: JQuery.MouseMoveEvent): void => {
    if (canvas.isDrawing) {
      const x0 = ev.pageX - ev.target["offsetLeft"];
      const y0 = ev.pageY - ev.target["offsetTop"];
      const width = x0 - canvas.currentShape.position.x;
      const height = y0 - canvas.currentShape.position.y;
      let currShape;

      // TODO: Find a way to remove the casting step

      switch (canvas.penShape) {
        case "pencil":
          currShape = canvas.currentShape as Pencil;
          currShape.addPoint(x0, y0);
          break;
        case "line":
          currShape = canvas.currentShape as Line;
          currShape.setEndPoint(x0, y0);
          break;
        case "rectangle":
          currShape = canvas.currentShape as Rectangle;
          currShape.setSize(width, height);
          break;
        case "circle":
          currShape = canvas.currentShape as Circle;
          currShape.setSize(x0, y0);
          break;
        case "eraser":
          currShape = canvas.currentShape as Pencil;
          currShape.addPoint(x0, y0);
          break;
      }

      // Draw shape while mouse is moving
      canvas.redraw();
      canvas.currentShape.draw(canvas.ctx);
    }
  });

  $("#my-canvas").mouseup((): void => {
    if (canvas.penShape !== "text") {
      canvas.shapes.push(canvas.currentShape);
      canvas.redraw();
    }

    canvas.isDrawing = false;
  });

  $(".text-spawner").keydown((ev: JQuery.KeyDownEvent): void => {
    if (canvas.isDrawing) {
      if (ev.which === 13) {
        const currShape = canvas.currentShape as Text;
        currShape.setText = canvas.currentInputBox.val() as string;

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
});
