import { expect, test } from "bun:test"
import { mat4, vec4 } from "gl-matrix"
import { getCadModelPlacement } from "../index"
import { expectPlacedPoint, nativeBounds } from "./fixtures/cad-placement"

test("loader maps affect native origin and normal once and retain deliberate reflections", () => {
  // Native +Y becomes canonical +Z, and native +X is deliberately mirrored.
  const loader = mat4.fromValues(
    -1,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    -1,
    0,
    0,
    7,
    11,
    13,
    1,
  )
  const placement = getCadModelPlacement(
    {
      position: { x: 10, y: 20, z: 30 },
      model_origin_position: { x: 1, y: 2, z: 3 },
      model_board_normal_direction: "y+",
      model_unit_to_mm_scale_factor: 2,
    },
    { nativeBounds, nativeToCanonicalModel: loader },
  )
  expectPlacedPoint(placement.nativeToWorld, [1, 2, 3], [10, 20, 30])
  expectPlacedPoint(placement.nativeToWorld, [3, 5, 8], [6, 10, 36])
  expect(placement.origin.canonicalModel).toEqual({ x: 6, y: 8, z: 15 })
  expect(mat4.determinant(placement.nativeToWorld)).toBeCloseTo(-8)
  const direction = vec4.transformMat4(
    vec4.create(),
    [0, 1, 0, 0],
    placement.nativeToWorld,
  )
  expect(Array.from(direction)).toEqual([0, 0, 2, 0])
  expect(placement.modelNormalWorld).toEqual({ x: 0, y: 0, z: 1 })
  expect(Array.from(loader).slice(12)).toEqual([7, 11, 13, 1])
})
