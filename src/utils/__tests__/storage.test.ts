import { beforeEach, describe, expect, test } from "bun:test";
import { save, load, clear } from "../storage";
import Pencil from "../../models/pencil";
import Rectangle from "../../models/rectangle";
import Text from "../../models/text";

describe("storage", () => {
  beforeEach(() => {
    clear();
  });

  test("should add new objects to local storage", async () => {
    const shapes = [
      new Pencil(0, 0, "blue", 4),
      new Rectangle(10, 10, "red", 200, 20, 40),
    ];

    const parsedData = {
      data: [
        {
          color: "blue",
          position: { x: 0, y: 0 },
          lineWidth: 4,
          type: "pencil",
          points: [{ x: 0, y: 0 }],
        },
        {
          color: "red",
          position: { x: 10, y: 10 },
          size: 200,
          width: 20,
          height: 40,
          type: "rectangle",
        },
      ],
      date: expect.any(String),
    };

    expect(await load()).toEqual({});
    await save("first", shapes);

    expect(await load()).toEqual({ first: parsedData });

    clear();

    expect(await load()).toEqual({});

    await save("second", shapes);
    expect(await load()).toEqual({ second: parsedData });
  });

  test("existing entries are overwritten", async () => {
    await save("priceless art", [
      new Text(100, 50, "black", "Hello, world!", 14),
    ]);

    expect(await load()).toEqual({
      "priceless art": {
        data: [
          {
            color: "black",
            position: { x: 100, y: 50 },
            text: "Hello, world!",
            fontSize: 14,
            type: "text",
          },
        ],
        date: expect.any(String),
      },
    });

    await save("priceless art", [
      new Text(200, 500, "red", "Goodbye, world!", 30),
    ]);

    expect(await load()).toEqual({
      "priceless art": {
        data: [
          {
            color: "red",
            position: { x: 200, y: 500 },
            text: "Goodbye, world!",
            fontSize: 30,
            type: "text",
          },
        ],
        date: expect.any(String),
      },
    });
  });

  test("should allow to delete everything, or a specific item", async () => {
    const key = "priceless art";

    await save(key, [new Text(100, 50, "black", "Hello, world!", 14)]);
    await save("foo", [new Rectangle(10, 10, "red", 200, 20, 40)]);

    expect(await load()).toHaveProperty(key);
    expect(await load()).toHaveProperty("foo");

    await clear(key);

    expect(await load()).not.toHaveProperty(key);
    expect(await load()).toHaveProperty("foo");

    await clear();

    expect(await load()).toEqual({});
  });
});
