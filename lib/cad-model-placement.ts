import type { CadComponent, CadModelAxisDirection, Point3 } from "circuit-json"
import { mat3, mat4, quat, vec3, type ReadonlyMat4 } from "gl-matrix"
import {
  applyMat4ToPoint3,
  composeMat4,
  quaternionFromEulerDegrees,
} from "./matrix-transforms"

/** A measured axis-aligned envelope, not a substitute for the body's solid. */
export interface CadModelBounds {
  min: Point3
  max: Point3
}

/** Circuit JSON world position in mm and intrinsic XYZ Euler angles in degrees. */
export type CadModelPlacementFields = Pick<
  CadComponent,
  | "position"
  | "rotation"
  | "size"
  | "model_unit_to_mm_scale_factor"
  | "model_board_normal_direction"
  | "model_origin_position"
  | "model_origin_alignment"
> &
  Partial<Pick<CadComponent, "anchor_alignment" | "model_object_fit">>

export interface CadModelPlacementOptions {
  /** Measured body envelope in the asset's native axes, origin and units. */
  nativeBounds: CadModelBounds
  /**
   * Explicit affine loader map from native coordinates to canonical model axes.
   * May deliberately reflect. Include loader node transforms here exactly once;
   * format defaults, scene conversion and asset loading belong to the adapter.
   */
  nativeToCanonicalModel: ReadonlyMat4
  /**
   * Required with cad.size. Target dimensions are mm, either in native axes
   * before the loader/normal rotation, or board-aligned axes before cad.rotation.
   */
  sizeSpace?: "native" | "board"
  /** A measured contact-center POINT in native coordinates, never a pad guess. */
  boardContactPoint?: Point3
  /** Optional board-local mm -> Circuit JSON world mm frame (right-handed Z-up). */
  boardToWorld?: ReadonlyMat4
}

export interface CadModelOrigin {
  provenance:
    | "explicit"
    | "native_origin"
    | "bounds_center"
    | "bottom_bounds_center"
    | "board_contact_center"
  /** POINT in native asset axes and units. */
  native: Point3
  /** POINT after the loader map, before units, fit and board-normal alignment. */
  canonicalModel: Point3
  /** POINT in right-handed Circuit JSON Z-up world, mm; equals cad.position. */
  world: Point3
}

export interface CadModelPlacement {
  /** Column-major affine matrix. Apply this SAME matrix to vertices and solids. */
  nativeToWorld: mat4
  /** inverse(boardToWorld) * nativeToWorld, when boardToWorld was supplied. */
  nativeToBoard?: mat4
  /**
   * Conservative world envelope from nativeBounds transformed once. For exact
   * collision, transform the actual solid/vertices, not this envelope.
   */
  worldBounds: CadModelBounds
  origin: CadModelOrigin
  /** Dimensionless fit factors in sizeSpace (unit conversion is separate). */
  fitScale: Point3
  /** Unit DIRECTION in Circuit JSON world; translation is excluded. */
  modelNormalWorld: Point3
}

const axes = ["x", "y", "z"] as const
const nativeNormals = {
  "x+": [1, 0, 0],
  "x-": [-1, 0, 0],
  "y+": [0, 1, 0],
  "y-": [0, -1, 0],
  "z+": [0, 0, 1],
  "z-": [0, 0, -1],
} satisfies Record<
  NonNullable<CadComponent["model_board_normal_direction"]>,
  [number, number, number]
>

function toVector(point: Point3): [number, number, number] {
  return [point.x, point.y, point.z]
}

function toPoint(vector: vec3): Point3 {
  return { x: vector[0]!, y: vector[1]!, z: vector[2]! }
}

function assertPoint(point: Point3, name: string) {
  if (axes.some((axis) => !Number.isFinite(point[axis]))) {
    throw new Error(`${name} must have finite x, y and z coordinates`)
  }
}

function assertBounds(bounds: CadModelBounds, name = "nativeBounds") {
  assertPoint(bounds.min, `${name}.min`)
  assertPoint(bounds.max, `${name}.max`)
  if (axes.some((axis) => bounds.min[axis] > bounds.max[axis])) {
    throw new Error(`${name}.min must not exceed ${name}.max`)
  }
}

function transformPoint(point: Point3, matrix: ReadonlyMat4): Point3 {
  return applyMat4ToPoint3(matrix, point)
}

function transformBounds(
  bounds: CadModelBounds,
  matrix: ReadonlyMat4,
): CadModelBounds {
  const min = new Float64Array([Infinity, Infinity, Infinity])
  const max = new Float64Array([-Infinity, -Infinity, -Infinity])
  const point = new Float64Array(3)
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        vec3.transformMat4(point, [x, y, z], matrix)
        vec3.min(min, min, point)
        vec3.max(max, max, point)
      }
    }
  }
  return { min: toPoint(min), max: toPoint(max) }
}

/**
 * Rotate the loader-transformed native up DIRECTION onto canonical +Z.
 * Translation is excluded. Identity loader preserves the established +Y Rx(90),
 * +X Ry(-90), and -Z Rx(180) roll. No bounds, scene frame or asset lookup needed.
 */
export function getCadModelBoardNormalQuaternion(
  direction: CadModelAxisDirection = "z+",
  nativeToCanonicalModel: ReadonlyMat4 = composeMat4(),
): quat {
  assertCadPlacementMatrix(nativeToCanonicalModel, "nativeToCanonicalModel")
  const canonicalNormal = vec3.transformMat3(
    new Float64Array(3),
    nativeNormals[direction],
    mat3.fromMat4(new Float64Array(9), nativeToCanonicalModel),
  )
  vec3.normalize(canonicalNormal, canonicalNormal)
  const rotation = quat.identity(new Float64Array(4))
  // gl-matrix's rotationTo closes over a Float32 scratch vector. Use its
  // axis-angle primitive with double-precision vectors, without global changes.
  const axis = vec3.cross(new Float64Array(3), canonicalNormal, [0, 0, 1])
  const sine = vec3.length(axis)
  const cosine = vec3.dot(canonicalNormal, [0, 0, 1])
  if (sine === 0) {
    if (cosine < 0) quat.setAxisAngle(rotation, [1, 0, 0], Math.PI)
    return rotation
  }
  vec3.normalize(axis, axis)
  return quat.setAxisAngle(rotation, axis, Math.atan2(sine, cosine))
}

/**
 * Dimensionless fit scales from a measured envelope and target size in the
 * SAME axes/units. Contain ignores flat axes; fill cannot expand a flat axis.
 * The caller chooses native-mm or board-aligned-mm bounds explicitly.
 */
export function getCadModelFitScaleFromBounds(
  bounds: CadModelBounds,
  size: Point3,
  fitMode: CadComponent["model_object_fit"] = "contain_within_bounds",
): Point3 {
  assertBounds(bounds, "bounds")
  assertPoint(size, "size")
  if (axes.some((axis) => size[axis] <= 0)) {
    throw new Error("size dimensions must be positive")
  }
  const extent = vec3.subtract(
    new Float64Array(3),
    toVector(bounds.max),
    toVector(bounds.min),
  )
  const ratios = toVector(size).map((target, axis) =>
    extent[axis]! > 0 ? target / extent[axis]! : Infinity,
  )
  if (fitMode === "fill_bounds") {
    if (ratios.some((ratio) => !Number.isFinite(ratio))) {
      throw new Error("fill_bounds cannot expand a zero-extent model axis")
    }
    return { x: ratios[0]!, y: ratios[1]!, z: ratios[2]! }
  }
  const uniformScale = Math.min(...ratios)
  if (!Number.isFinite(uniformScale)) {
    throw new Error("contain_within_bounds requires a nonzero model extent")
  }
  return { x: uniformScale, y: uniformScale, z: uniformScale }
}

function resolveOrigin(
  cad: CadModelPlacementFields,
  options: CadModelPlacementOptions,
  nativeToAligned: ReadonlyMat4,
): Pick<CadModelOrigin, "native" | "provenance"> {
  if (cad.model_origin_position) {
    assertPoint(cad.model_origin_position, "model_origin_position")
    return { native: { ...cad.model_origin_position }, provenance: "explicit" }
  }
  const alignment =
    cad.model_origin_alignment ?? cad.anchor_alignment ?? "unknown"
  if (alignment === "center_of_component_on_board_surface") {
    if (!options.boardContactPoint) {
      throw new Error(
        "center_of_component_on_board_surface requires a measured boardContactPoint",
      )
    }
    assertPoint(options.boardContactPoint, "boardContactPoint")
    return {
      native: { ...options.boardContactPoint },
      provenance: "board_contact_center",
    }
  }
  if (alignment === "center") {
    return {
      native: toPoint(
        vec3.lerp(
          new Float64Array(3),
          toVector(options.nativeBounds.min),
          toVector(options.nativeBounds.max),
          0.5,
        ),
      ),
      provenance: "bounds_center",
    }
  }
  if (alignment === "bottom_center_of_component") {
    const bounds = transformBounds(options.nativeBounds, nativeToAligned)
    return {
      native: transformPoint(
        {
          x: (bounds.min.x + bounds.max.x) / 2,
          y: (bounds.min.y + bounds.max.y) / 2,
          z: bounds.min.z,
        },
        invertCadPlacementMatrix(nativeToAligned, "nativeToAligned"),
      ),
      provenance: "bottom_bounds_center",
    }
  }
  return { native: { x: 0, y: 0, z: 0 }, provenance: "native_origin" }
}

/**
 * Native asset -> right-handed Circuit JSON Z-up world (mm).
 *
 * The schema's model normal is a native-space up DIRECTION (not a shading
 * normal); apply the loader's linear map, then rotate it onto +Z. CAD rotation
 * is already the complete world orientation, including any bottom-layer flip.
 * There is deliberately no PCB thickness, layer inference or format table.
 *
 * References: 3d-viewer/src/utils/cad-model-transform.ts#getCadModelTransform
 * (XYZ boundary and +Z normal), circuit-json-to-gltf/lib/utils/cad-mesh-placement.ts
 * (origin/fit), and the viewer's useCadModelTransformGraph.ts. Unlike the old
 * split offsets, the origin passes through the SAME units, fit and loader map.
 */
export function getCadModelPlacement(
  cad: CadModelPlacementFields,
  options: CadModelPlacementOptions,
): CadModelPlacement {
  assertBounds(options.nativeBounds)
  assertPoint(cad.position, "position")
  assertCadPlacementMatrix(
    options.nativeToCanonicalModel,
    "nativeToCanonicalModel",
  )
  const unitScale = cad.model_unit_to_mm_scale_factor ?? 1
  if (!Number.isFinite(unitScale) || unitScale <= 0) {
    throw new Error("model_unit_to_mm_scale_factor must be finite and positive")
  }
  if (cad.size && !options.sizeSpace) {
    throw new Error("sizeSpace must be explicit when size is provided")
  }
  const units = mat4.fromScaling(new Float64Array(16), [
    unitScale,
    unitScale,
    unitScale,
  ])
  let fitScale: Point3 = { x: 1, y: 1, z: 1 }
  const nativeToCanonicalMm = composeMat4(units, options.nativeToCanonicalModel)
  if (cad.size && options.sizeSpace === "native") {
    fitScale = getCadModelFitScaleFromBounds(
      transformBounds(options.nativeBounds, units),
      cad.size,
      cad.model_object_fit,
    )
    mat4.scale(nativeToCanonicalMm, nativeToCanonicalMm, toVector(fitScale))
  }
  const nativeNormal = nativeNormals[cad.model_board_normal_direction ?? "z+"]
  const normalRotation = getCadModelBoardNormalQuaternion(
    cad.model_board_normal_direction,
    nativeToCanonicalMm,
  )
  const nativeToAligned = composeMat4(
    mat4.fromQuat(new Float64Array(16), normalRotation),
    nativeToCanonicalMm,
  )
  const origin = resolveOrigin(cad, options, nativeToAligned)
  if (cad.size && options.sizeSpace === "board") {
    fitScale = getCadModelFitScaleFromBounds(
      transformBounds(options.nativeBounds, nativeToAligned),
      cad.size,
      cad.model_object_fit,
    )
    mat4.multiply(
      nativeToAligned,
      mat4.fromScaling(new Float64Array(16), toVector(fitScale)),
      nativeToAligned,
    )
  }
  const fittedOrigin = transformPoint(origin.native, nativeToAligned)
  const centeredModel = composeMat4(
    mat4.fromTranslation(
      new Float64Array(16),
      vec3.negate(new Float64Array(3), toVector(fittedOrigin)),
    ),
    nativeToAligned,
  )
  const rotation = cad.rotation ?? { x: 0, y: 0, z: 0 }
  assertPoint(rotation, "rotation")
  const nativeToWorld = composeMat4(
    mat4.fromRotationTranslation(
      new Float64Array(16),
      quaternionFromEulerDegrees(rotation, "xyz"),
      toVector(cad.position),
    ),
    centeredModel,
  )
  const normalWorld = vec3.transformMat3(
    new Float64Array(3),
    nativeNormal,
    mat3.fromMat4(new Float64Array(9), nativeToWorld),
  )
  vec3.normalize(normalWorld, normalWorld)
  return {
    nativeToWorld,
    nativeToBoard: options.boardToWorld
      ? composeMat4(
          invertCadPlacementMatrix(options.boardToWorld, "boardToWorld"),
          nativeToWorld,
        )
      : undefined,
    worldBounds: transformBounds(options.nativeBounds, nativeToWorld),
    origin: {
      ...origin,
      canonicalModel: transformPoint(
        origin.native,
        options.nativeToCanonicalModel,
      ),
      world: transformPoint(origin.native, nativeToWorld),
    },
    fitScale,
    modelNormalWorld: toPoint(normalWorld),
  }
}

/** Both frames use mm. targetToWorld places the target datum in Z-up world;
 * datumToModel places the mating datum in model-local space. */
export interface CadAssemblyPlacementOptions {
  targetToWorld: ReadonlyMat4
  datumToModel: ReadonlyMat4
}

/** Model -> world = targetToWorld * inverse(datumToModel). No Euler extraction. */
export function composeCadAssemblyPlacement({
  targetToWorld,
  datumToModel,
}: CadAssemblyPlacementOptions): mat4 {
  assertCadPlacementMatrix(targetToWorld, "targetToWorld")
  return composeMat4(
    targetToWorld,
    invertCadPlacementMatrix(datumToModel, "datumToModel"),
  )
}

function assertCadPlacementMatrix(matrix: ReadonlyMat4, name: string) {
  if (
    matrix.length !== 16 ||
    Array.from(matrix).some((value) => !Number.isFinite(value)) ||
    matrix[3] !== 0 ||
    matrix[7] !== 0 ||
    matrix[11] !== 0 ||
    matrix[15] !== 1 ||
    !Number.isFinite(mat4.determinant(matrix)) ||
    mat4.determinant(matrix) === 0
  ) {
    throw new Error(`${name} must be a finite, invertible affine mat4`)
  }
}

function invertCadPlacementMatrix(matrix: ReadonlyMat4, name: string): mat4 {
  assertCadPlacementMatrix(matrix, name)
  const inverse = mat4.invert(new Float64Array(16), matrix)
  if (!inverse) {
    throw new Error(`${name} must be invertible`)
  }
  return inverse
}
