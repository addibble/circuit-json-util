import { expect, test } from "bun:test"
import { mat4 } from "gl-matrix"
import { getCadModelPlacement, type CadModelPlacementFields } from "../index"
import { expectPlacedPoint } from "./fixtures/cad-placement"

test("off-origin points receive the same units, normal and contain/fill transforms as geometry", () => {
  const nativeBounds = {
    min: { x: 10, y: 20, z: 30 },
    max: { x: 16, y: 24, z: 50 },
  }
  const cad: CadModelPlacementFields = {
    position: { x: 100, y: 200, z: 300 },
    model_origin_position: { x: 11, y: 21, z: 32 },
    model_unit_to_mm_scale_factor: 2,
    model_board_normal_direction: "y+",
    model_object_fit: "fill_bounds",
    size: { x: 12, y: 16, z: 120 },
  }
  for (const sizeSpace of ["native", "board"] as const) {
    const placement = getCadModelPlacement(
      sizeSpace === "native" ? cad : { ...cad, size: { x: 12, y: 120, z: 16 } },
      {
        nativeBounds,
        nativeToCanonicalModel: mat4.create(),
        sizeSpace,
      },
    )
    expectPlacedPoint(placement.nativeToWorld, [11, 21, 32], [100, 200, 300])
    expectPlacedPoint(placement.nativeToWorld, [12, 22, 33], [102, 194, 304])
    expect(placement.origin.provenance).toBe("explicit")
    expect(placement.origin.world.x).toBeCloseTo(100, 4)
    expect(placement.origin.world.y).toBeCloseTo(200, 4)
    expect(placement.origin.world.z).toBeCloseTo(300, 4)
  }
  const contained = getCadModelPlacement(
    { ...cad, model_object_fit: "contain_within_bounds" },
    {
      nativeBounds,
      nativeToCanonicalModel: mat4.create(),
      sizeSpace: "native",
    },
  )
  expect(contained.fitScale).toEqual({ x: 1, y: 1, z: 1 })
  expectPlacedPoint(contained.nativeToWorld, [12, 22, 33], [102, 198, 302])
})
