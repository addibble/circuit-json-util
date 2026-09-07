import { expect, test } from "bun:test"
import {
  applyMat4ToDirection3,
  composeMat4,
  getCadModelBoardNormalQuaternion,
  mat4,
} from "../index"

test("public normal quaternion excludes loader translation and leaves loader reflection intact", () => {
  const loader = composeMat4(
    mat4.fromTranslation(new Float64Array(16), [100, 200, 300]),
    mat4.fromScaling(new Float64Array(16), [-1, 1, 1]),
    mat4.fromXRotation(new Float64Array(16), Math.PI / 2),
  )
  const normal = getCadModelBoardNormalQuaternion("y+", loader)
  const nativeToAligned = composeMat4(
    mat4.fromQuat(new Float64Array(16), normal),
    loader,
  )
  const aligned = applyMat4ToDirection3(nativeToAligned, { x: 0, y: 1, z: 0 })
  expect(aligned.x).toBeCloseTo(0, 12)
  expect(aligned.y).toBeCloseTo(0, 12)
  expect(aligned.z).toBeCloseTo(1, 12)
  expect(mat4.determinant(nativeToAligned)).toBeCloseTo(-1, 12)
  expect(() =>
    getCadModelBoardNormalQuaternion(
      "z+",
      mat4.fromScaling(new Float64Array(16), [1, 0, 1]),
    ),
  ).toThrow("invertible affine mat4")
})
