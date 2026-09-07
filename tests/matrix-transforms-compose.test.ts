import { expect, test } from "bun:test"
import { compose, rotateDEG, scale, translate } from "transformation-matrix"
import {
  applyMat4ToDirection3,
  applyMat4ToPoint2,
  applyMat4ToPoint3,
  composeMat4,
  mat4,
  mat4FromPlanarMatrix,
} from "../index"

test("public mat4 composition preserves rightmost-first noncommutative operation order", () => {
  const translation = mat4FromPlanarMatrix(translate(10, 20))
  const rotation = mat4FromPlanarMatrix(rotateDEG(90))
  const reflection = mat4FromPlanarMatrix(scale(1, -1))
  const rotationThenReflection = composeMat4(translation, reflection, rotation)
  const reflectionThenRotation = composeMat4(translation, rotation, reflection)
  const point = { x: 2, y: 3, z: 5 }
  expect(applyMat4ToPoint3(rotationThenReflection, point)).toEqual({
    x: 7,
    y: 18,
    z: 5,
  })
  expect(applyMat4ToPoint3(reflectionThenRotation, point)).toEqual({
    x: 13,
    y: 22,
    z: 5,
  })
  expect(applyMat4ToPoint3(composeMat4(rotation, translation), point)).toEqual({
    x: -23,
    y: 12.000000000000002,
    z: 5,
  })
  expect(applyMat4ToDirection3(rotationThenReflection, point)).toEqual({
    x: -3,
    y: -2,
    z: 5,
  })
  expect(applyMat4ToPoint2(rotationThenReflection, point)).toEqual({
    x: 7,
    y: 18,
  })
  const planar = mat4FromPlanarMatrix(
    compose(translate(10, 20), scale(1, -1), rotateDEG(90)),
  )
  expect(Array.from(rotationThenReflection)).toEqual(Array.from(planar))
  expect(mat4.determinant(rotationThenReflection)).toBeCloseTo(-1)
  expect(Array.from(composeMat4())).toEqual(Array.from(mat4.create()))
  const copy = composeMat4(translation)
  expect(copy).not.toBe(translation)
  expect(Array.from(copy)).toEqual(Array.from(translation))
})
