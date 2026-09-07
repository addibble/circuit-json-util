import { expect, test } from "bun:test"
import {
  applyMat4ToDirection3,
  composeMat4,
  directionToVec,
  mat4,
  rotateClockwise,
  rotateCounterClockwise,
  rotateDirection,
  vecToDirection,
} from "../index"

type Direction = Parameters<typeof rotateDirection>[0]

// Frozen symbolic transitions from b35bf44:lib/direction-to-vec.ts.
const clockwise: Record<Direction, Direction> = {
  up: "right",
  right: "down",
  down: "left",
  left: "up",
}
const counterClockwise: Record<Direction, Direction> = {
  up: "left",
  left: "down",
  down: "right",
  right: "up",
}

test("existing cardinal rotation APIs map to the same mat4 sequence as the legacy transitions", () => {
  const clockwiseMatrix = mat4.fromZRotation(new Float64Array(16), -Math.PI / 2)
  const counterClockwiseMatrix = mat4.fromZRotation(
    new Float64Array(16),
    Math.PI / 2,
  )
  for (const direction of ["up", "right", "down", "left"] as const) {
    expect(rotateClockwise(direction)).toBe(clockwise[direction])
    expect(rotateCounterClockwise(direction)).toBe(counterClockwise[direction])
    for (const turns of [-4, -2.5, -1.5, -0.5, 0, 0.5, 1.5, 2.5, 4]) {
      let remaining = turns
      let reference: Direction = direction
      let referenceMatrix = composeMat4()
      // Preserve the old algorithm's actual two-loop operation sequence.
      while (remaining > 0) {
        reference = clockwise[reference]
        referenceMatrix = composeMat4(clockwiseMatrix, referenceMatrix)
        remaining--
      }
      while (remaining < 0) {
        reference = counterClockwise[reference]
        referenceMatrix = composeMat4(counterClockwiseMatrix, referenceMatrix)
        remaining++
      }
      const actual = rotateDirection(direction, turns)
      expect(actual).toBe(reference)
      const transformed = applyMat4ToDirection3(referenceMatrix, {
        ...directionToVec(direction),
        z: 0,
      })
      expect(transformed.x).toBeCloseTo(directionToVec(actual).x, 10)
      expect(transformed.y).toBeCloseTo(directionToVec(actual).y, 10)
    }
  }
  expect(rotateDirection("right", 0.5)).toBe("right")
  expect(rotateDirection("right", -0.5)).toBe("up")
  // Do not incidentally change the separate signed-component quantizer.
  expect(() => vecToDirection({ x: -1, y: 0 })).toThrow(
    "Invalid vector for direction conversion",
  )
})
