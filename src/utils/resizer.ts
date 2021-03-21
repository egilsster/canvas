export default function ResizeCanvas(canvasElement: HTMLCanvasElement): void {
  const container = document.querySelector("#canvas-container") as HTMLDivElement;
  const canvas = canvasElement;

  canvas.setAttribute("width", String(container.clientWidth));
  canvas.setAttribute("height", String(container.clientHeight));
}
