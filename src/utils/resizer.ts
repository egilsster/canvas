function calcCanvasWidth(containerEl: HTMLDivElement): {
  width: number;
  height: number;
} {
  const style = window.getComputedStyle(containerEl);
  const width = containerEl.offsetWidth;
  const height = containerEl.offsetHeight;

  const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  const padding =
    parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  const border =
    parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

  const totalAvailableHeight = height - margin - padding - border;
  const totalAvailableWidth = width - margin - padding - border;

  return { width: totalAvailableWidth, height: totalAvailableHeight };
}

export default function ResizeCanvas(canvasEl: HTMLCanvasElement): void {
  const container = document.querySelector(
    "#canvas-container",
  ) as HTMLDivElement;

  const { width, height } = calcCanvasWidth(container);
  canvasEl.setAttribute("width", String(width));
  canvasEl.setAttribute("height", String(height));
}
