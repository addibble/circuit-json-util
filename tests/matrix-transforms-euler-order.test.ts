import { expect, test } from "bun:test"
import {
  applyMat4ToPoint3,
  mat4,
  quat,
  quaternionFromEulerDegrees,
  type EulerRotationOrder,
  type ReadonlyMat4,
  type ReadonlyQuat,
} from "../index"

test("explicit intrinsic Euler orders convert once to the public quaternion primitive", () => {
  const cases: Array<{
    order: EulerRotationOrder
    expected: [number, number, number]
  }> = [
    { order: "xyz", expected: [5, -3, 2] },
    { order: "xzy", expected: [-3, 2, 5] },
    { order: "yxz", expected: [2, -5, 3] },
    { order: "yzx", expected: [3, 2, -5] },
    { order: "zxy", expected: [-2, 5, 3] },
    { order: "zyx", expected: [5, 3, -2] },
  ]
  for (const { order, expected } of cases) {
    const rotation: ReadonlyQuat = quaternionFromEulerDegrees(
      { x: 90, y: 90, z: 90 },
      order,
    )
    const matrix: ReadonlyMat4 = mat4.fromQuat(new Float64Array(16), rotation)
    const actual = applyMat4ToPoint3(matrix, { x: 2, y: 3, z: 5 })
    expect(actual.x).toBeCloseTo(expected[0], 10)
    expect(actual.y).toBeCloseTo(expected[1], 10)
    expect(actual.z).toBeCloseTo(expected[2], 10)
    expect(quat.length(rotation)).toBeCloseTo(1, 10)
    expect(mat4.determinant(matrix)).toBeCloseTo(1, 10)
  }
})
