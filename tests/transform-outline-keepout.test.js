import { expect, test } from "bun:test"
import { compose, rotateDEG, scale, translate } from "transformation-matrix"
import { transformPCBElement, transformPCBElements } from "../index"

// JS exercises a newer peer's runtime shape without changing the pinned dev
// circuit-json types, which only declare centered keepouts.
test("newer outline keepouts use the same matrix while centered keepouts retain their behavior", () => {
  const matrix = compose(translate(10, 20), scale(1, -1), rotateDEG(90))
  for (const batch of [false, true]) {
    const outline = {
      type: "pcb_keepout",
      pcb_keepout_id: "outline_keepout",
      shape: "outline",
      layers: ["top"],
      stroke_width: 0.1,
      outline: [
        { x: 2, y: 3 },
        { x: 4, y: 3 },
        { x: 4, y: 5 },
      ],
    }
    const rect = {
      type: "pcb_keepout",
      pcb_keepout_id: "rect_keepout",
      shape: "rect",
      layers: ["top"],
      center: { x: 2, y: 3 },
      width: 6,
      height: 4,
    }
    if (batch) {
      expect(transformPCBElements([outline, rect], matrix)[0]).toBe(outline)
    } else {
      expect(transformPCBElement(outline, matrix)).toBe(outline)
      transformPCBElement(rect, matrix)
    }
    expect(outline.outline).toEqual([
      { x: 7, y: 18 },
      { x: 7, y: 16 },
      { x: 5, y: 16 },
    ])
    expect(outline.stroke_width).toBe(0.1)
    expect(rect.center).toEqual({ x: 7, y: 18 })
    expect([rect.width, rect.height]).toEqual([6, 4])
  }
})
