import { expect, test } from "bun:test"
import { mat4 } from "gl-matrix"
import { getCadModelPlacement } from "../index"
import { expectPlacedPoint, nativeBounds } from "./fixtures/cad-placement"

test("native 6x4x20 with +Y normal becomes 6x20x4 rather than fitting back to raw axes", () => {
  const cad = {
    position: { x: 0, y: 0, z: 0 },
    model_board_normal_direction: "y+" as const,
    size: { x: 6, y: 4, z: 20 },
  }
  const nativeFit = getCadModelPlacement(cad, {
    nativeBounds,
    nativeToCanonicalModel: mat4.create(),
    sizeSpace: "native",
  })
  expect(nativeFit.fitScale).toEqual({ x: 1, y: 1, z: 1 })
  expectPlacedPoint(nativeFit.nativeToWorld, [3, 2, 20], [3, -20, 2])
  expect(nativeFit.worldBounds.max.x - nativeFit.worldBounds.min.x).toBeCloseTo(
    6,
  )
  expect(nativeFit.worldBounds.max.y - nativeFit.worldBounds.min.y).toBeCloseTo(
    20,
  )
  expect(nativeFit.worldBounds.max.z - nativeFit.worldBounds.min.z).toBeCloseTo(
    4,
  )

  const boardFit = getCadModelPlacement(
    { ...cad, model_object_fit: "fill_bounds" },
    {
      nativeBounds,
      nativeToCanonicalModel: mat4.create(),
      sizeSpace: "board",
    },
  )
  expect(boardFit.fitScale.x).toBeCloseTo(1)
  expect(boardFit.fitScale.y).toBeCloseTo(0.2)
  expect(boardFit.fitScale.z).toBeCloseTo(5)
  expectPlacedPoint(boardFit.nativeToWorld, [3, 2, 20], [3, -4, 10])
})
