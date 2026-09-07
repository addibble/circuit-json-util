import { expect, test } from "bun:test"
import { getCadModelFitScaleFromBounds, type CadModelBounds } from "../index"

test("public fit primitive uses measured same-frame extents and explicit flat-axis policy", () => {
  const bounds: CadModelBounds = {
    min: { x: 10, y: 20, z: 30 },
    max: { x: 16, y: 24, z: 50 },
  }
  const target = { x: 12, y: 12, z: 80 }
  expect(getCadModelFitScaleFromBounds(bounds, target)).toEqual({
    x: 2,
    y: 2,
    z: 2,
  })
  expect(getCadModelFitScaleFromBounds(bounds, target, "fill_bounds")).toEqual({
    x: 2,
    y: 3,
    z: 4,
  })
  const flatBounds = { ...bounds, max: { ...bounds.max, z: bounds.min.z } }
  expect(getCadModelFitScaleFromBounds(flatBounds, target)).toEqual({
    x: 2,
    y: 2,
    z: 2,
  })
  expect(() =>
    getCadModelFitScaleFromBounds(flatBounds, target, "fill_bounds"),
  ).toThrow("zero-extent")
  expect(() =>
    getCadModelFitScaleFromBounds(
      {
        min: { x: 1, y: 0, z: 0 },
        max: { x: 0, y: 1, z: 1 },
      },
      target,
    ),
  ).toThrow("bounds.min must not exceed bounds.max")
  expect(bounds.min).toEqual({ x: 10, y: 20, z: 30 })
})
