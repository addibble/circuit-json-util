import { expect, test } from "bun:test"
import { mat4, vec3 } from "gl-matrix"
import { getCadModelPlacement } from "../index"
import { expectPlacedPoint } from "./fixtures/cad-placement"

test("body envelopes use the final matrix once and never replace available vertices", () => {
  const nativeBounds = {
    min: { x: 1, y: 2, z: 3 },
    max: { x: 5, y: 8, z: 13 },
  }
  const loader = mat4.fromZRotation(mat4.create(), Math.PI / 4)
  const cancelling = getCadModelPlacement(
    {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: -45 },
    },
    { nativeBounds, nativeToCanonicalModel: loader },
  )
  // Re-boxing after the loader and again after CAD rotation would enlarge it.
  expect(cancelling.worldBounds.min.x).toBeCloseTo(1, 4)
  expect(cancelling.worldBounds.min.y).toBeCloseTo(2, 4)
  expect(cancelling.worldBounds.max.x).toBeCloseTo(5, 4)
  expect(cancelling.worldBounds.max.y).toBeCloseTo(8, 4)
  expectPlacedPoint(cancelling.nativeToWorld, [5, 8, 13], [5, 8, 13])

  const rotated = getCadModelPlacement(
    {
      position: { x: 10, y: 20, z: 30 },
      rotation: { x: 0, y: 0, z: 45 },
      model_origin_position: nativeBounds.min,
    },
    { nativeBounds, nativeToCanonicalModel: mat4.create() },
  )
  expect(rotated.worldBounds.min.x).toBeCloseTo(5.757359, 4)
  expect(rotated.worldBounds.max.y).toBeCloseTo(27.071068, 4)
  const actualVertices = [
    vec3.fromValues(1, 2, 3),
    vec3.fromValues(5, 2, 3),
    vec3.fromValues(1, 8, 13),
  ].map((point) =>
    vec3.transformMat4(vec3.create(), point, rotated.nativeToWorld),
  )
  const actualMaxY = Math.max(...actualVertices.map((point) => point[1]!))
  expect(actualMaxY).toBeCloseTo(24.242641, 4)
  expect(actualMaxY).toBeLessThan(rotated.worldBounds.max.y)
})
