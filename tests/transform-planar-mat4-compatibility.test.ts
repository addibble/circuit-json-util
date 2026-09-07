import { expect, test } from "bun:test"
import type { CadComponent, PcbComponent, SchematicPort } from "circuit-json"
import { compose, rotateDEG, scale, translate } from "transformation-matrix"
import {
  transformPCBElement,
  transformPCBElements,
  transformSchematicElement,
  transformSchematicElements,
} from "../index"

test("legacy planar entry points preserve mutation, TSR metadata and compose ordering over mat4", () => {
  const cases = [
    {
      matrix: translate(10, 20),
      center: { x: 12, y: 23 },
      rotation: 0,
      insertion: "from_right",
      facing: "right",
      width: 4,
      height: 2,
    },
    {
      matrix: compose(translate(10, 20), rotateDEG(90)),
      center: { x: 7, y: 22 },
      rotation: 90,
      insertion: "from_top",
      facing: "up",
      width: 2,
      height: 4,
    },
    {
      matrix: compose(translate(10, 20), scale(1, -1), rotateDEG(90)),
      center: { x: 7, y: 18 },
      rotation: 90,
      insertion: "from_bottom",
      facing: "down",
      width: 2,
      height: 4,
    },
    {
      matrix: compose(translate(10, 20), rotateDEG(90), scale(1, -1)),
      center: { x: 13, y: 22 },
      rotation: -90,
      insertion: "from_top",
      facing: "up",
      width: 2,
      height: 4,
    },
  ] as const
  for (const expected of cases) {
    for (const batch of [false, true]) {
      const pcb: PcbComponent = {
        type: "pcb_component",
        pcb_component_id: "pcb_component_0",
        source_component_id: "source_component_0",
        layer: "top",
        center: { x: 2, y: 3 },
        width: 4,
        height: 2,
        rotation: 0,
        obstructs_within_bounds: true,
        insertion_direction: "from_right",
      }
      const cad: CadComponent = {
        type: "cad_component",
        cad_component_id: "cad_component_0",
        pcb_component_id: pcb.pcb_component_id,
        source_component_id: pcb.source_component_id,
        position: { x: 2, y: 3, z: 5 },
        rotation: { x: 11, y: 22, z: 33 },
        size: { x: 6, y: 4, z: 20 },
        model_object_fit: "contain_within_bounds",
        anchor_alignment: "center",
      }
      const schematic: SchematicPort = {
        type: "schematic_port",
        schematic_port_id: "schematic_port_0",
        source_port_id: "source_port_0",
        center: { x: 2, y: 3 },
        facing_direction: "right",
      }
      if (batch) {
        expect(transformPCBElements([pcb, cad], expected.matrix)[0]).toBe(pcb)
        expect(
          transformSchematicElements([schematic], expected.matrix)[0],
        ).toBe(schematic)
      } else {
        expect(transformPCBElement(pcb, expected.matrix)).toBe(pcb)
        transformPCBElement(cad, expected.matrix)
        expect(transformSchematicElement(schematic, expected.matrix)).toBe(
          schematic,
        )
      }
      expect(pcb.center).toEqual(expected.center)
      expect(pcb.rotation).toBe(expected.rotation)
      expect(pcb.insertion_direction).toBe(expected.insertion)
      expect([pcb.width, pcb.height]).toEqual([expected.width, expected.height])
      expect(schematic.center).toEqual(expected.center)
      expect(schematic.facing_direction).toBe(expected.facing)
      // Planar editing intentionally still does not rotate CAD orientation.
      expect(cad.position).toEqual({ ...expected.center, z: 5 })
      expect(cad.rotation).toEqual({ x: 11, y: 22, z: 33 })
      expect(cad.size).toEqual({ x: 6, y: 4, z: 20 })
    }
  }
})
