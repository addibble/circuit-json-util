import { expect, test } from "bun:test"
import { getCadModelPlacement, mat4, quat } from "../index"

test("CAD placement keeps measured heights, origins and inverse frames in double precision", () => {
  const matrixAllocation = mat4.create().constructor
  const quaternionAllocation = quat.create().constructor
  for (const normal of ["y+", "z+"] as const) {
    const placement = getCadModelPlacement(
      {
        position: { x: 0.1, y: -0.2, z: 1.6 },
        model_board_normal_direction: normal,
      },
      {
        nativeBounds: {
          min: { x: 0, y: 0, z: 0 },
          max: normal === "y+" ? { x: 6, y: 4, z: 20 } : { x: 6, y: 20, z: 4 },
        },
        nativeToCanonicalModel: mat4.identity(new Float64Array(16)),
        boardToWorld: mat4.fromTranslation(
          new Float64Array(16),
          [0.1, -0.2, 0],
        ),
      },
    )
    expect(placement.nativeToWorld).toBeInstanceOf(Float64Array)
    expect(placement.nativeToBoard).toBeInstanceOf(Float64Array)
    expect(
      placement.worldBounds.max.z - placement.worldBounds.min.z,
    ).toBeCloseTo(4, 12)
    expect(placement.worldBounds.max.z - 1.6).toBeCloseTo(4, 12)
  }
  const fitted = getCadModelPlacement(
    {
      position: { x: 0.1, y: -0.2, z: 1.6 },
      model_board_normal_direction: "y+",
      model_unit_to_mm_scale_factor: 0.1,
      size: { x: 6.0000001234, y: 4.0000001234, z: 20.0000001234 },
      model_object_fit: "fill_bounds",
      model_origin_alignment: "center",
    },
    {
      nativeBounds: {
        min: { x: 10.1, y: 20.2, z: 30.3 },
        max: { x: 16.1, y: 24.2, z: 50.3 },
      },
      nativeToCanonicalModel: mat4.identity(new Float64Array(16)),
      sizeSpace: "native",
    },
  )
  expect(fitted.worldBounds.max.z - fitted.worldBounds.min.z).toBeCloseTo(
    4.0000001234,
    12,
  )
  expect(fitted.worldBounds.max.y - fitted.worldBounds.min.y).toBeCloseTo(
    20.0000001234,
    12,
  )
  expect(fitted.origin.native.x).toBeCloseTo(13.1, 12)
  expect(fitted.origin.native.y).toBeCloseTo(22.2, 12)
  expect(fitted.origin.world.z).toBeCloseTo(1.6, 12)
  expect(mat4.create().constructor).toBe(matrixAllocation)
  expect(quat.create().constructor).toBe(quaternionAllocation)
})
