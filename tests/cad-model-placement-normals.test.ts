import { expect, test } from "bun:test"
import type { CadComponent } from "circuit-json"
import { mat4, quat } from "gl-matrix"
import {
  getCadModelBoardNormalQuaternion,
  getCadModelPlacement,
} from "../index"
import { expectPlacedPoint, nativeBounds } from "./fixtures/cad-placement"

test("all six native normals align to +Z with known asymmetric markers", () => {
  const cases: Array<{
    normal: NonNullable<CadComponent["model_board_normal_direction"]>
    marker: [number, number, number]
  }> = [
    { normal: "x+", marker: [-5, 3, 2] },
    { normal: "x-", marker: [5, 3, -2] },
    { normal: "y+", marker: [2, -5, 3] },
    { normal: "y-", marker: [2, 5, -3] },
    { normal: "z+", marker: [2, 3, 5] },
    { normal: "z-", marker: [2, -3, -5] },
  ]
  for (const { normal, marker } of cases) {
    const normalQuaternion = getCadModelBoardNormalQuaternion(normal)
    expect(quat.length(normalQuaternion)).toBeCloseTo(1, 12)
    expectPlacedPoint(
      mat4.fromQuat(new Float64Array(16), normalQuaternion),
      [2, 3, 5],
      marker,
    )
    const placement = getCadModelPlacement(
      {
        position: { x: 0, y: 0, z: 0 },
        model_board_normal_direction: normal,
      },
      { nativeBounds, nativeToCanonicalModel: mat4.create() },
    )
    expectPlacedPoint(placement.nativeToWorld, [2, 3, 5], marker)
    expect(placement.modelNormalWorld.x).toBeCloseTo(0)
    expect(placement.modelNormalWorld.y).toBeCloseTo(0)
    expect(placement.modelNormalWorld.z).toBeCloseTo(1)
    expect(mat4.determinant(placement.nativeToWorld)).toBeCloseTo(1)
  }
})
