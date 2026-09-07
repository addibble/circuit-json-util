import type { Point, Point3 } from "circuit-json"
import type { Matrix } from "transformation-matrix"
import { mat4, quat, vec2, vec4, type ReadonlyMat4 } from "gl-matrix"

// Expose the underlying primitives, not an independent matrix/quaternion engine.
export { mat4, quat } from "gl-matrix"
export type { ReadonlyMat4, ReadonlyQuat } from "gl-matrix"

export type EulerRotationOrder = NonNullable<
  Parameters<typeof quat.fromEuler>[4]
>

/** Intrinsic Euler angles in DEGREES, with an explicit axis order.
 * Uses double precision without changing gl-matrix's global allocation policy. */
export function quaternionFromEulerDegrees(
  rotation: Point3,
  order: EulerRotationOrder,
): quat {
  return quat.fromEuler(
    new Float64Array(4),
    rotation.x,
    rotation.y,
    rotation.z,
    order,
  )
}

/** Column-major A * B * C: C acts first. Left-associated multiplication,
 * matching transformation-matrix.compose. No arguments returns identity.
 * Inputs are not mutated; output retains double precision. */
export function composeMat4(...matrices: ReadonlyMat4[]): mat4 {
  const result = mat4.identity(new Float64Array(16))
  const first = matrices[0]
  if (!first) return result
  mat4.copy(result, first)
  for (const matrix of matrices.slice(1)) {
    mat4.multiply(result, result, matrix)
  }
  return result
}

/** Lift the existing affine XY map into a Z-preserving mat4 without
 * decomposing it. Shear, reflections, translation and singular maps survive. */
export function mat4FromPlanarMatrix(matrix: Matrix): mat4 {
  return [
    matrix.a,
    matrix.b,
    0,
    0,
    matrix.c,
    matrix.d,
    0,
    0,
    0,
    0,
    1,
    0,
    matrix.e,
    matrix.f,
    0,
    1,
  ]
}

/** Affine POINT (w=1) -> the matrix's output frame; includes translation.
 * Units and axes follow the supplied matrix; no renderer frame is inferred. */
export function applyMat4ToPoint3(matrix: ReadonlyMat4, point: Point3): Point3 {
  const output = vec4.transformMat4(
    new Float64Array(4),
    [point.x, point.y, point.z, 1],
    matrix,
  )
  return { x: output[0]!, y: output[1]!, z: output[2]! }
}

/** DIRECTION (w=0) -> the matrix's output frame; excludes translation.
 * Preserves scale/magnitude; this is not a shading-normal inverse transpose. */
export function applyMat4ToDirection3(
  matrix: ReadonlyMat4,
  direction: Point3,
): Point3 {
  const output = vec4.transformMat4(
    new Float64Array(4),
    [direction.x, direction.y, direction.z, 0],
    matrix,
  )
  return { x: output[0]!, y: output[1]!, z: output[2]! }
}

/** Affine XY POINT at z=0, projected back to XY. gl-matrix's 2D-on-mat4
 * primitive preserves the legacy a*x + c*y + e arithmetic and Number precision. */
export function applyMat4ToPoint2(matrix: ReadonlyMat4, point: Point): Point {
  const output = vec2.transformMat4(
    new Float64Array(2),
    [point.x, point.y],
    matrix,
  )
  return { x: output[0]!, y: output[1]! }
}
