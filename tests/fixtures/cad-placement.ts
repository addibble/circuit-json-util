import { expect } from "bun:test"
import { vec3, type ReadonlyMat4, type ReadonlyVec3 } from "gl-matrix"
import type { CadModelBounds } from "../../index"

export const nativeBounds: CadModelBounds = {
  min: { x: -3, y: -2, z: 0 },
  max: { x: 3, y: 2, z: 20 },
}

export function expectPlacedPoint(
  matrix: ReadonlyMat4,
  native: ReadonlyVec3,
  expected: ReadonlyVec3,
) {
  const actual = vec3.transformMat4(vec3.create(), native, matrix)
  for (const axis of [0, 1, 2]) {
    expect(actual[axis]!).toBeCloseTo(expected[axis]!, 4)
  }
}
