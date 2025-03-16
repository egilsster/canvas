import Picker from "vanilla-picker";
import type Circle from "./models/circle";
import type Line from "./models/line";
import type Pencil from "./models/pencil";
import type Rectangle from "./models/rectangle";
import type Text from "./models/text";
import "./style.css";
import Canvas from "./utils/canvas";
import { getConfig } from "./utils/config";
import ResizeCanvas from "./utils/resizer";
import { clear, load, save } from "./utils/storage";

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
  const loadCanvasDialog = document.querySelector(
    "#load-canvas-modal",
  ) as HTMLDialogElement;

  const closeDialog = () => {
    loadCanvasDialog.open = false;
  };

  loadCanvasDialog.onkeydown = (evt) => {
    if (evt.key === "Escape") {
      closeDialog();
    }
  };

  const config = getConfig();

  penShapeElement.value = config.penShape;
  penSizeElement.value = String(config.penSize);

  // Resize the whiteboard to match width and height of window
  ResizeCanvas(canvasElement);
  window.addEventListener("resize", () => ResizeCanvas(canvasElement));

  const canvas = new Canvas(canvasElement);

  penColorElement.style.background = config.penColor;
  new Picker({
    parent: penColorElement,
    color: config.penColor,
    onDone: (color) => {
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

  document.querySelector("#clear-canvas")?.addEventListener("click", () => {
    const ok = confirm("Are you sure you want to clear everything?");
    if (ok) {
      canvas.clearCanvas();
    }
  });
  document
    .querySelector("#undo")
    ?.addEventListener("click", () => canvas.redoShape());
  document
    .querySelector("#redo")
    ?.addEventListener("click", () => canvas.undoShape());
  document
    .querySelector("#save-canvas")
    ?.addEventListener("click", async () => {
      if (canvas.shapes.length === 0) {
        alert("Maybe a bit too minimal.. draw something first.");
        return;
      }
      const name = prompt("What's should your art be called?");
      if (!name) {
        return;
      }
      await save(name, canvas.shapes);
    });
  document
    .querySelector("#load-canvas")
    ?.addEventListener("click", async () => {
      // Open dialog and put it in focus
      loadCanvasDialog.open = true;
      loadCanvasDialog.focus();

      const savedDrawingsUl = document.getElementById(
        "saved-list",
      ) as HTMLUListElement;
      savedDrawingsUl.textContent = "";

      const savedEntries = Object.entries(await load());
      if (savedEntries.length === 0) {
        // todo
        const placeholder = document.createElement("div");
        placeholder.className =
          "text-gray-500 flex w-full h-full justify-center mt-20";
        placeholder.innerText = "Your drawings have been stolen!";
        savedDrawingsUl.appendChild(placeholder);
      } else {
        for (const [name, { data, date }] of savedEntries) {
          const listItem = document.createElement("li");
          listItem.className =
            "transition-colors flex justify-between cursor-pointer py-1 ring-1 ring-gray-500/25 m-0.5 px-1.5 rounded-xs hover:bg-gray-100 items-center";

          const nameEl = document.createElement("span");
          nameEl.className = "truncate w-1/2";
          nameEl.textContent = name;
          nameEl.title = `Load "${name}"`;

          // YYYY-MM-DD, HH:MM:SS
          const formattedDate = new Intl.DateTimeFormat("en-UK", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date(date));

          const dateEl = document.createElement("span");
          dateEl.textContent = formattedDate;
          dateEl.title = `Saved ${formattedDate}`;
          dateEl.className = "text-gray-500 text-sm";

          const deleteButton = document.createElement("button");
          deleteButton.className =
            "transition-colors text-red-600 hover:text-red-500 active:text-red-700 h-4 w-4 ml-2";
          deleteButton.title = `Delete "${name}"`;
          deleteButton.onclick = async (evt) => {
            evt.stopPropagation();
            await clear(name);
            closeDialog();
          };
          deleteButton.innerHTML = `<svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17 5V4C17 2.89543 16.1046 2 15 2H9C7.89543 2 7 2.89543 7 4V5H4C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H5V18C5 19.6569 6.34315 21 8 21H16C17.6569 21 19 19.6569 19 18V7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H17ZM15 4H9V5H15V4ZM17 7H7V18C7 18.5523 7.44772 19 8 19H16C16.5523 19 17 18.5523 17 18V7Z"
            fill="currentColor"
          />
          <path d="M9 9H11V17H9V9Z" fill="currentColor" />
          <path d="M13 9H15V17H13V9Z" fill="currentColor" />
        </svg>`;

          const rightSide = document.createElement("div");
          rightSide.className = "flex flex-row items-center";

          rightSide.appendChild(dateEl);
          rightSide.appendChild(deleteButton);

          listItem.appendChild(nameEl);
          listItem.appendChild(rightSide);

          listItem.onclick = () => {
            canvas.clearCanvas();
            canvas.drawLoaded(data);
            closeDialog();
          };

          savedDrawingsUl.appendChild(listItem);
        }
      }
    });

  // Remove and clear each entry
  document
    .querySelector("#clear-saved")
    ?.addEventListener("click", async () => {
      const ok = confirm("Are you sure you want to clear saved drawings?");
      if (!ok) {
        return;
      }
      await clear();
    });

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
      if (ev.key === "Enter") {
        const currShape = canvas.currentShape as Text;
        currShape.setText = canvas.currentInputBox.value;

        canvas.shapes.push(canvas.currentShape);
        canvas.currentShape.draw(canvas.ctx);

        canvas.isDrawing = false;
        canvas.currentInputBox.remove();
      } else if (ev.key === "Escape") {
        canvas.isDrawing = false;
        canvas.currentInputBox.remove();
      }
    }
  });
})();
