import Shape from "../models/shape";

const LS_KEY = "egilsster/canvas:drawings";

type StorageData = {
  /** stringified list of shapes */
  data: object[];
  /** when the canvas was saved */
  date: Date;
};

/**
 * Reads from local-storage and parses it.
 *
 * If nothing is in local-storage, an empty object is returned.
 */
export async function load(): Promise<Record<string, StorageData>> {
  return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
}

/**
 * Saves all the items on the canvas to local-storage under the key `name`.
 * Overwrites them if `name` is already there.
 */
export async function save(name: string, drawings: Shape[]): Promise<void> {
  const allDrawings = await load();
  allDrawings[name] = { data: drawings, date: new Date() };
  localStorage.setItem(LS_KEY, JSON.stringify(allDrawings));
}

export async function clear(key?: string): Promise<void> {
  if (key) {
    const allDrawings = await load();
    delete allDrawings[key];
    localStorage.setItem(LS_KEY, JSON.stringify(allDrawings));
  } else {
    // Remove everything
    localStorage.removeItem(LS_KEY);
  }
}
