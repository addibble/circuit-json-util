import { expect, test } from "bun:test"
import { mat4 } from "gl-matrix"
import { getCadModelPlacement } from "../index"
import { expectPlacedPoint } from "./fixtures/cad-placement"

test("inferred origin provenance distinguishes measured contact, envelope center and source zero", () => {
  const options = {
    nativeBounds: {
      min: { x: 10, y: 20, z: 30 },
      max: { x: 16, y: 24, z: 50 },
    },
    nativeToCanonicalModel: mat4.create(),
  }
  const cad = {
    position: { x: 0, y: 0, z: 0 },
    model_board_normal_direction: "y+" as const,
  }
  const center = getCadModelPlacement(
    { ...cad, model_origin_alignment: "center" },
    options,
  )
  expect(center.origin.native).toEqual({ x: 13, y: 22, z: 40 })
  expect(center.origin.provenance).toBe("bounds_center")
  expectPlacedPoint(center.nativeToWorld, [13, 22, 40], [0, 0, 0])
  const bottom = getCadModelPlacement(
    { ...cad, model_origin_alignment: "bottom_center_of_component" },
    options,
  )
  expect(bottom.origin.provenance).toBe("bottom_bounds_center")
  expectPlacedPoint(bottom.nativeToWorld, [13, 20, 40], [0, 0, 0])

  const contactCad = {
    ...cad,
    model_origin_alignment: "center_of_component_on_board_surface" as const,
  }
  const contact = getCadModelPlacement(contactCad, {
    ...options,
    boardContactPoint: { x: 12, y: 20, z: 39 },
  })
  expect(contact.origin.provenance).toBe("board_contact_center")
  expectPlacedPoint(contact.nativeToWorld, [12, 20, 39], [0, 0, 0])
  expect(() => getCadModelPlacement(contactCad, options)).toThrow(
    "requires a measured boardContactPoint",
  )
  const explicit = getCadModelPlacement(
    { ...contactCad, model_origin_position: { x: 11, y: 21, z: 31 } },
    options,
  )
  expect(explicit.origin.provenance).toBe("explicit")
  const unknown = getCadModelPlacement(
    { ...cad, model_origin_alignment: "unknown", anchor_alignment: "center" },
    options,
  )
  expect(unknown.origin.native).toEqual({ x: 0, y: 0, z: 0 })
  expect(unknown.origin.provenance).toBe("native_origin")
})
