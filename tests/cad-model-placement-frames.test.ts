import { expect, test } from "bun:test"
import { mat4 } from "gl-matrix"
import { composeCadAssemblyPlacement, getCadModelPlacement } from "../index"
import { expectPlacedPoint, nativeBounds } from "./fixtures/cad-placement"

test("assembly target/local datum and optional board factoring remain composed matrices", () => {
  const targetToWorld = mat4.fromTranslation(mat4.create(), [100, 200, 300])
  mat4.rotateZ(targetToWorld, targetToWorld, Math.PI / 2)
  const datumToModel = mat4.fromTranslation(mat4.create(), [2, 3, 5])
  mat4.rotateX(datumToModel, datumToModel, Math.PI / 2)
  const modelToWorld = composeCadAssemblyPlacement({
    targetToWorld,
    datumToModel,
  })
  // Datum origin and its off-axis [1,2,3] marker, expressed in model space.
  expectPlacedPoint(modelToWorld, [2, 3, 5], [100, 200, 300])
  expectPlacedPoint(modelToWorld, [3, 0, 7], [98, 201, 303])
  const placement = getCadModelPlacement(
    { position: { x: 98, y: 201, z: 303 } },
    {
      nativeBounds,
      nativeToCanonicalModel: mat4.create(),
      boardToWorld: targetToWorld,
    },
  )
  expect(placement.nativeToBoard).toBeDefined()
  expectPlacedPoint(placement.nativeToBoard!, [0, 0, 0], [1, 2, 3])
  expectPlacedPoint(
    mat4.multiply(mat4.create(), targetToWorld, placement.nativeToBoard!),
    [2, 3, 5],
    [100, 204, 308],
  )
})
