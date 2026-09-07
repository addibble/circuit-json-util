import { expect, test } from "bun:test"
import { applyToPoint, type Matrix } from "transformation-matrix"
import {
  applyMat4ToPoint2,
  applyMat4ToPoint3,
  mat4FromPlanarMatrix,
} from "../index"

test("planar lifting preserves Number precision, shear and singular-map behavior without decomposition", () => {
  const cases: Array<{
    matrix: Matrix
    point: { x: number; y: number }
    expected: { x: number; y: number }
  }> = [
    {
      matrix: { a: 1, b: 0, c: 0, d: 1, e: 0.25, f: -0.125 },
      point: { x: 16_777_217.125, y: -16_777_217.25 },
      expected: { x: 16_777_217.375, y: -16_777_217.375 },
    },
    {
      matrix: { a: 2, b: 3, c: 5, d: 7, e: 11, f: 13 },
      point: { x: 2, y: 3 },
      expected: { x: 30, y: 40 },
    },
    {
      matrix: { a: 0, b: 0, c: 0, d: 0, e: 11, f: 13 },
      point: { x: 2, y: 3 },
      expected: { x: 11, y: 13 },
    },
  ]
  for (const { matrix, point, expected } of cases) {
    const lifted = mat4FromPlanarMatrix(matrix)
    expect(applyMat4ToPoint2(lifted, point)).toEqual(expected)
    expect(applyMat4ToPoint2(lifted, point)).toEqual(
      applyToPoint(matrix, point),
    )
    expect(applyMat4ToPoint3(lifted, { ...point, z: 17 })).toEqual({
      ...expected,
      z: 17,
    })
  }
})
