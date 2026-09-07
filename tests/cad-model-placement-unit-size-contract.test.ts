import { expect, test } from "bun:test"
import { applyMat4ToPoint3, composeMat4, getCadModelPlacement } from "../index"

test("model units scale native geometry but never multiply an already-mm target size", () => {
  const cad = {
    position: { x: 10, y: 20, z: 30 },
    model_origin_position: { x: 2, y: 3, z: 5 },
    model_board_normal_direction: "y+" as const,
    model_unit_to_mm_scale_factor: 2,
  }
  const options = {
    nativeBounds: {
      min: { x: 2, y: 3, z: 5 },
      max: { x: 3, y: 4, z: 6 },
    },
    nativeToCanonicalModel: composeMat4(),
  }
  const unsized = getCadModelPlacement(cad, options)
  const unsizedMarker = applyMat4ToPoint3(
    unsized.nativeToWorld,
    options.nativeBounds.max,
  )
  expect(unsizedMarker.x).toBeCloseTo(12, 12)
  expect(unsizedMarker.y).toBeCloseTo(18, 12)
  expect(unsizedMarker.z).toBeCloseTo(32, 12)

  for (const fitMode of ["contain_within_bounds", "fill_bounds"] as const) {
    for (const sizeSpace of ["native", "board"] as const) {
      const sized = getCadModelPlacement(
        { ...cad, size: { x: 1, y: 1, z: 1 }, model_object_fit: fitMode },
        { ...options, sizeSpace },
      )
      const marker = applyMat4ToPoint3(
        sized.nativeToWorld,
        options.nativeBounds.max,
      )
      expect(marker.x).toBeCloseTo(11, 12)
      expect(marker.y).toBeCloseTo(19, 12)
      expect(marker.z).toBeCloseTo(31, 12)
      for (const axis of ["x", "y", "z"] as const) {
        expect(
          sized.worldBounds.max[axis] - sized.worldBounds.min[axis],
        ).toBeCloseTo(1, 12)
        expect(sized.origin.world[axis]).toBeCloseTo(cad.position[axis], 12)
      }
    }
  }
})
