import { expect, test } from "bun:test"
import {
  applyMat4ToDirection3,
  composeMat4,
  getCadModelBoardNormalQuaternion,
  mat4,
} from "../index"

test("normal alignment avoids Float32 scratch and near-parallel angle snapping", () => {
  const oblique = mat4.fromRotation(new Float64Array(16), 1.234, [1, 2, 3])
  expect(oblique).not.toBeNull()
  for (const loader of [
    oblique!,
    mat4.fromXRotation(new Float64Array(16), 0.00001),
    mat4.fromXRotation(new Float64Array(16), Math.PI - 0.00001),
  ]) {
    const rotation = getCadModelBoardNormalQuaternion("z+", loader)
    expect(rotation).toBeInstanceOf(Float64Array)
    const nativeToAligned = composeMat4(
      mat4.fromQuat(new Float64Array(16), rotation),
      loader,
    )
    const normal = applyMat4ToDirection3(nativeToAligned, { x: 0, y: 0, z: 1 })
    expect(normal.x).toBeCloseTo(0, 12)
    expect(normal.y).toBeCloseTo(0, 12)
    expect(normal.z).toBeCloseTo(1, 12)
  }
})
