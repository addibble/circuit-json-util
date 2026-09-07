import {
  applyMat4ToDirection3,
  mat4,
  quaternionFromEulerDegrees,
} from "./matrix-transforms"

export const directionToVec = (direction: "up" | "down" | "left" | "right") => {
  if (direction === "up") return { x: 0, y: 1 }
  else if (direction === "down") return { x: 0, y: -1 }
  else if (direction === "left") return { x: -1, y: 0 }
  else if (direction === "right") return { x: 1, y: 0 }
  else throw new Error("Invalid direction")
}

export const vecToDirection = ({ x, y }: { x: number; y: number }) => {
  if (x > y) y = 0
  if (y > x) x = 0
  if (x > 0 && y === 0) return "right"
  else if (x < 0 && y === 0) return "left"
  else if (x === 0 && y > 0) return "up"
  else if (x === 0 && y < 0) return "down"
  else throw new Error(`Invalid vector for direction conversion (${x}, ${y})`)
}

const rotateCardinalDirection = (
  direction: "up" | "down" | "left" | "right",
  rotationDegrees: -90 | 90,
) => {
  if (
    direction !== "up" &&
    direction !== "down" &&
    direction !== "left" &&
    direction !== "right"
  ) {
    throw new Error(`Invalid direction: ${direction}`)
  }
  const rotated = applyMat4ToDirection3(
    mat4.fromQuat(
      new Float64Array(16),
      quaternionFromEulerDegrees({ x: 0, y: 0, z: rotationDegrees }, "xyz"),
    ),
    { ...directionToVec(direction), z: 0 },
  )
  // These are unit cardinal vectors, not vecToDirection's signed-component
  // quantization. Keep that existing API's different behavior unchanged.
  if (Math.abs(rotated.x) > 0.5) {
    return rotated.x > 0 ? "right" : "left"
  }
  return rotated.y > 0 ? "up" : "down"
}

export const rotateClockwise = (direction: "up" | "down" | "left" | "right") =>
  rotateCardinalDirection(direction, -90)

export const rotateCounterClockwise = (
  direction: "up" | "down" | "left" | "right",
) => rotateCardinalDirection(direction, 90)

export const rotateDirection = (
  direction: "up" | "down" | "left" | "right",
  num90DegreeClockwiseTurns: number,
) => {
  // Retain both loops in this order: fractional positive counts can leave a
  // negative remainder that the second loop then rotates back.
  while (num90DegreeClockwiseTurns > 0) {
    direction = rotateClockwise(direction)
    num90DegreeClockwiseTurns--
  }
  while (num90DegreeClockwiseTurns < 0) {
    direction = rotateCounterClockwise(direction)
    num90DegreeClockwiseTurns++
  }
  return direction
}

export const oppositeDirection = (
  direction: "up" | "down" | "left" | "right",
) => {
  if (direction === "up") return "down"
  else if (direction === "down") return "up"
  else if (direction === "left") return "right"
  else if (direction === "right") return "left"
  throw new Error(`Invalid direction: ${direction}`)
}

export const oppositeSide = (
  sideOrDir: "up" | "down" | "top" | "bottom" | "left" | "right",
) => {
  if (sideOrDir === "top" || sideOrDir === "up") return "bottom"
  else if (sideOrDir === "bottom" || sideOrDir === "down") return "top"
  else if (sideOrDir === "left") return "right"
  else if (sideOrDir === "right") return "left"
  throw new Error(`Invalid sideOrDir: ${sideOrDir}`)
}
