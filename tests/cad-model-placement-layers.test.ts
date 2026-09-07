import { expect, test } from "bun:test"
import { mat4 } from "gl-matrix"
import { getCadModelPlacement } from "../index"
import { expectPlacedPoint, nativeBounds } from "./fixtures/cad-placement"

test("complete XYZ CAD rotations preserve top/bottom markers at all quarter turns", () => {
  const cases = [
    { z: 0, top: [12, -17, 6], bottom: [12, -23, -4] },
    { z: 90, top: [7, -18, 6], bottom: [7, -22, -4] },
    { z: 180, top: [8, -23, 6], bottom: [8, -17, -4] },
    { z: 270, top: [13, -22, 6], bottom: [13, -18, -4] },
  ]
  for (const { z, top, bottom } of cases) {
    for (const layer of ["top", "bottom"] as const) {
      const placement = getCadModelPlacement(
        {
          position: { x: 10, y: -20, z: 1 },
          rotation: { x: layer === "bottom" ? 180 : 0, y: 0, z },
        },
        { nativeBounds, nativeToCanonicalModel: mat4.create() },
      )
      expectPlacedPoint(
        placement.nativeToWorld,
        [2, 3, 5],
        layer === "top" ? top : bottom,
      )
      expect(placement.modelNormalWorld.z).toBeCloseTo(layer === "top" ? 1 : -1)
      expect(mat4.determinant(placement.nativeToWorld)).toBeCloseTo(1)
    }
  }
})
