import { expect, test } from "bun:test"
import { mat4 } from "gl-matrix"
import { composeCadAssemblyPlacement, getCadModelPlacement } from "../index"
import { nativeBounds } from "./fixtures/cad-placement"

test("invalid or ambiguous placement inputs fail rather than returning a success-shaped identity", () => {
  const cad = { position: { x: 0, y: 0, z: 0 } }
  const options = { nativeBounds, nativeToCanonicalModel: mat4.create() }
  const size = { x: 6, y: 4, z: 20 }
  expect(() => getCadModelPlacement({ ...cad, size }, options)).toThrow(
    "sizeSpace",
  )
  for (const unitScale of [0, -1, NaN, Infinity]) {
    expect(() =>
      getCadModelPlacement(
        { ...cad, model_unit_to_mm_scale_factor: unitScale },
        options,
      ),
    ).toThrow("finite and positive")
  }
  const singular = mat4.fromScaling(mat4.create(), [1, 0, 1])
  expect(() =>
    getCadModelPlacement(cad, { ...options, nativeToCanonicalModel: singular }),
  ).toThrow("invertible affine mat4")
  expect(() =>
    composeCadAssemblyPlacement({
      targetToWorld: mat4.create(),
      datumToModel: singular,
    }),
  ).toThrow("invertible affine mat4")
  const perspective = mat4.perspective(mat4.create(), 1, 1, 0.1, 100)
  expect(() =>
    getCadModelPlacement(cad, {
      ...options,
      nativeToCanonicalModel: perspective,
    }),
  ).toThrow("invertible affine mat4")
  expect(() =>
    getCadModelPlacement({ position: { x: NaN, y: 0, z: 0 } }, options),
  ).toThrow("position must have finite")
  expect(() =>
    getCadModelPlacement(cad, {
      ...options,
      nativeBounds: { min: { x: 10, y: 0, z: 0 }, max: { x: 0, y: 1, z: 1 } },
    }),
  ).toThrow("min must not exceed")
  const planarOptions = {
    ...options,
    sizeSpace: "native" as const,
    nativeBounds: {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 6, y: 4, z: 0 },
    },
  }
  expect(() =>
    getCadModelPlacement(
      { ...cad, size, model_object_fit: "fill_bounds" },
      planarOptions,
    ),
  ).toThrow("zero-extent")
  expect(
    getCadModelPlacement({ ...cad, size }, planarOptions).fitScale,
  ).toEqual({ x: 1, y: 1, z: 1 })
})
