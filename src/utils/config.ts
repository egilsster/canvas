const DEFAULTS = Object.freeze({
  penColor: "black",
  penShape: "pencil",
  penSize: 4,
});

export const KEYS = Object.freeze({
  penColor: "canvas-pen-color",
  penShape: "canvas-pen-shape",
  penSize: "canvas-pen-size",
});

export type Config = {
  penColor: string;
  penShape: string;
  penSize: number;
};

export function setKey(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function getConfig(): Config {
  const config: Config = {
    penColor: localStorage.getItem(KEYS.penColor) ?? DEFAULTS.penColor,
    penShape: localStorage.getItem(KEYS.penShape) ?? DEFAULTS.penShape,
    penSize: Number(localStorage.getItem(KEYS.penSize) ?? DEFAULTS.penSize),
  };

  return config;
}
