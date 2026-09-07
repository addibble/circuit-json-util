# @tscircuit/circuit-json-util

> Previously released as `@tscircuit/soup-util`

This is a small utility library for working with [circuit json](https://github.com/tscircuit/circuit-json)

It reduces the amount of code to retrieve or join elements from circuit json, it also neatly handles all the typing.

## Exported API

| Function | Defined in | Description |
| --- | --- | --- |
| `cju` | [`lib/cju.ts`](./lib/cju.ts) | Creates the primary circuit-json utility object for querying and mutating circuit json arrays. |
| `su` | [`lib/cju.ts`](./lib/cju.ts) | Alias for `cju`. |
| `cjuIndexed` | [`lib/cju-indexed.ts`](./lib/cju-indexed.ts) | Creates an indexed utility optimized for large circuit-json datasets. |
| `transformSchematicElement` | [`lib/transform-soup-elements.ts`](./lib/transform-soup-elements.ts) | Applies a transformation matrix to a single schematic element. |
| `transformSchematicElements` | [`lib/transform-soup-elements.ts`](./lib/transform-soup-elements.ts) | Applies a transformation matrix to schematic elements in a soup. |
| `transformPCBElement` | [`lib/transform-soup-elements.ts`](./lib/transform-soup-elements.ts) | Applies a transformation matrix to a single PCB element. |
| `transformPCBElements` | [`lib/transform-soup-elements.ts`](./lib/transform-soup-elements.ts) | Applies a transformation matrix to PCB elements in a soup. |
| `transformPcbElement` | [`lib/transform-soup-elements.ts`](./lib/transform-soup-elements.ts) | Alias export for `transformPCBElement`. |
| `transformPcbElements` | [`lib/transform-soup-elements.ts`](./lib/transform-soup-elements.ts) | Alias export for `transformPCBElements`. |
| `getCadModelPlacement` | [`lib/cad-model-placement.ts`](./lib/cad-model-placement.ts) | Composes native CAD geometry placement into a single Circuit JSON world mat4, with explicit loader, fit and origin provenance. |
| `getCadModelBoardNormalQuaternion` | [`lib/cad-model-placement.ts`](./lib/cad-model-placement.ts) | Returns the shared quaternion aligning a loader-transformed native up direction to canonical +Z. |
| `getCadModelFitScaleFromBounds` | [`lib/cad-model-placement.ts`](./lib/cad-model-placement.ts) | Returns contain/fill scales from measured bounds and a target in the same frame and units. |
| `composeCadAssemblyPlacement` | [`lib/cad-model-placement.ts`](./lib/cad-model-placement.ts) | Places a model's local mating datum at an assembly target using `targetToWorld * inverse(datumToModel)`. |
| `mat4`, `quat` | [`lib/matrix-transforms.ts`](./lib/matrix-transforms.ts) | Selectively exposes gl-matrix's typed matrix and quaternion primitives. |
| `quaternionFromEulerDegrees` | [`lib/matrix-transforms.ts`](./lib/matrix-transforms.ts) | Converts intrinsic Euler degrees with an explicitly required rotation order. |
| `composeMat4` | [`lib/matrix-transforms.ts`](./lib/matrix-transforms.ts) | Composes matrices left-associatively as `A * B * C`; the rightmost acts first. |
| `mat4FromPlanarMatrix` | [`lib/matrix-transforms.ts`](./lib/matrix-transforms.ts) | Lifts an existing `transformation-matrix` affine XY map into a Z-preserving mat4. |
| `applyMat4ToPoint2` | [`lib/matrix-transforms.ts`](./lib/matrix-transforms.ts) | Applies an affine mat4 to an XY point at Z=0 and returns XY. |
| `applyMat4ToPoint3` | [`lib/matrix-transforms.ts`](./lib/matrix-transforms.ts) | Applies an affine mat4 to a 3D point, including translation. |
| `applyMat4ToDirection3` | [`lib/matrix-transforms.ts`](./lib/matrix-transforms.ts) | Applies the linear part of a mat4 to a direction, excluding translation and retaining magnitude. |
| `directionToVec` | [`lib/direction-to-vec.ts`](./lib/direction-to-vec.ts) | Converts a cardinal direction to a vector. |
| `vecToDirection` | [`lib/direction-to-vec.ts`](./lib/direction-to-vec.ts) | Converts a vector to its nearest cardinal direction. |
| `rotateClockwise` | [`lib/direction-to-vec.ts`](./lib/direction-to-vec.ts) | Rotates a cardinal direction clockwise. |
| `rotateCounterClockwise` | [`lib/direction-to-vec.ts`](./lib/direction-to-vec.ts) | Rotates a cardinal direction counter-clockwise. |
| `rotateDirection` | [`lib/direction-to-vec.ts`](./lib/direction-to-vec.ts) | Rotates a direction by one or more quarter turns. |
| `oppositeDirection` | [`lib/direction-to-vec.ts`](./lib/direction-to-vec.ts) | Returns the opposite cardinal direction. |
| `oppositeSide` | [`lib/direction-to-vec.ts`](./lib/direction-to-vec.ts) | Returns the opposite side string (`left/right/top/bottom`). |
| `applySelector` | [`lib/apply-selector.ts`](./lib/apply-selector.ts) | Applies a selector string to circuit-json elements. |
| `applySelectorAST` | [`lib/apply-selector.ts`](./lib/apply-selector.ts) | Applies a parsed selector AST to circuit-json elements. |
| `getElementById` | [`lib/get-element-by-id.ts`](./lib/get-element-by-id.ts) | Finds an element by its primary id field. |
| `getElementId` | [`lib/get-element-id.ts`](./lib/get-element-id.ts) | Returns an element's primary id value. |
| `getReadableNameForElement` | [`lib/readable-name-functions/get-readable-name-for-element.ts`](./lib/readable-name-functions/get-readable-name-for-element.ts) | Produces a human-readable label for an element. |
| `getReadableNameForPcbPort` | [`lib/readable-name-functions/get-readable-name-for-pcb-port.ts`](./lib/readable-name-functions/get-readable-name-for-pcb-port.ts) | Produces a readable label for a PCB port. |
| `getReadableNameForPcbSmtpad` | [`lib/readable-name-functions/get-readable-name-for-pcb-smtpad.ts`](./lib/readable-name-functions/get-readable-name-for-pcb-smtpad.ts) | Produces a readable label for a PCB SMT pad. |
| `getReadableNameForPcbTrace` | [`lib/readable-name-functions/get-readable-name-for-pcb-trace.ts`](./lib/readable-name-functions/get-readable-name-for-pcb-trace.ts) | Produces a readable label for a PCB trace. |
| `getBoundsOfPcbElements` | [`lib/get-bounds-of-pcb-elements.ts`](./lib/get-bounds-of-pcb-elements.ts) | Computes aggregate XY bounds for PCB elements. |
| `getPcbElementBounds` | [`lib/get-bounds-of-pcb-elements.ts`](./lib/get-bounds-of-pcb-elements.ts) | Computes the axis-aligned XY bounds of one PCB element. |
| `getPcbElementsWithinBounds` | [`lib/get-bounds-of-pcb-elements.ts`](./lib/get-bounds-of-pcb-elements.ts) | Selects PCB elements whose bounds intersect a region. |
| `getBoardBounds` | [`lib/get-board-bounds.ts`](./lib/get-board-bounds.ts) | Computes board bounds/size from `width`+`height`+`center`, or from `outline` points. |
| `getSchematicElementBounds` | [`lib/get-schematic-element-bounds.ts`](./lib/get-schematic-element-bounds.ts) | Computes the axis-aligned bounds of a schematic component, net label, or trace. |
| `findBoundsAndCenter` | [`lib/find-bounds-and-center.ts`](./lib/find-bounds-and-center.ts) | Computes bounds and center for a set of points. |
| `getPrimaryId` | [`lib/get-primary-id.ts`](./lib/get-primary-id.ts) | Returns the name of an element type's primary id field. |
| `buildSubtree` | [`lib/subtree.ts`](./lib/subtree.ts) | Builds a relation-aware subtree from selected root elements. |
| `repositionPcbComponentTo` | [`lib/reposition-pcb-component.ts`](./lib/reposition-pcb-component.ts) | Repositions a PCB component and its linked PCB primitives. |
| `repositionPcbGroupTo` | [`lib/reposition-pcb-group.ts`](./lib/reposition-pcb-group.ts) | Repositions all PCB elements in a source group. |
| `repositionSchematicComponentTo` | [`lib/reposition-schematic-component.ts`](./lib/reposition-schematic-component.ts) | Repositions a schematic component and linked schematic primitives. |
| `repositionSchematicGroupTo` | [`lib/reposition-schematic-group.ts`](./lib/reposition-schematic-group.ts) | Repositions all schematic elements in a source group. |
| `getCircuitJsonTree` | [`lib/getCircuitJsonTree.ts`](./lib/getCircuitJsonTree.ts) | Builds a tree representation of relation-linked circuit-json elements. |
| `getStringFromCircuitJsonTree` | [`lib/getStringFromCircuitJsonTree.ts`](./lib/getStringFromCircuitJsonTree.ts) | Renders a circuit-json tree as text for debugging. |
| `getMinimumFlexContainer` | [`lib/get-minimum-flex-container.ts`](./lib/get-minimum-flex-container.ts) | Computes a minimum flex container from layout constraints. |
| `getElementRenderLayers` | [`lib/get-element-render-layers.ts`](./lib/get-element-render-layers.ts) | Returns schematic/PCB render layers used for an element. |
| `computeClearanceBetweenElements` | [`lib/compute-clearance-between-elements.ts`](./lib/compute-clearance-between-elements.ts) | Computes the minimum edge-to-edge clearance between two circuit elements using geometric decomposition. |
| `computeGapBetweenCopper` | [`lib/compute-gap-between-copper.ts`](./lib/compute-gap-between-copper.ts) | Computes the minimum copper-to-copper gap between two circuit elements by decomposing them into primitive shapes. |
| `analyzePcbPin1Location` | [`lib/analyze-pcb-pin1-location.ts`](./lib/analyze-pcb-pin1-location.ts) | Infers a semantic pin 1 location from PCB pad geometry and numeric port hints. |
| `categorizeErrorOrWarning` | [`lib/categorize-error-or-warning.ts`](./lib/categorize-error-or-warning.ts) | Categorizes DRC error/warning types into `"netlist"`, `"pin_specification"`, `"placement"`, `"routing"`, `"source"`, or `"unknown"`. |

## Matrix and quaternion primitives

The public `mat4` and `quat` namespaces are the actual **gl-matrix** primitives,
not another math implementation. `ReadonlyMat4`, `ReadonlyQuat`, and
`EulerRotationOrder` are exported as types. The small adapters below them use
double-precision outputs without changing gl-matrix's global allocation policy.
Direct `mat4.create()`/`quat.create()` retain gl-matrix's own allocation defaults.
All util-owned placement matrices, quaternions, bounds/fit calculations and
scratch buffers use double precision. Normal alignment uses gl-matrix's
axis-angle primitive with double-precision vectors, avoiding `rotationTo`'s
internal Float32 scratch buffer. Callers constructing input matrices should
likewise supply `new Float64Array(16)` as the output buffer when precision matters.
For planner serialization, use `toTransformMatrix(matrix)` from
`@tscircuit/jscad-planner`, or copy the entries and use that package's
`assertTransformMatrix`. The planner owns its plain 16-number tuple and
validation; do not cast or rebuild scalar transforms. This library returns
double-precision matrices without depending on JSCAD or duplicating the
planner's conversion.

```ts
import {
  applyMat4ToDirection3,
  applyMat4ToPoint3,
  composeMat4,
  mat4,
  quaternionFromEulerDegrees,
} from "@tscircuit/circuit-json-util"

const rotation = quaternionFromEulerDegrees({ x: 0, y: 0, z: 90 }, "xyz")
const localToWorld = composeMat4(
  mat4.fromTranslation(new Float64Array(16), [10, 20, 30]),
  mat4.fromQuat(new Float64Array(16), rotation),
)
const position = applyMat4ToPoint3(localToWorld, { x: 2, y: 3, z: 5 })
const direction = applyMat4ToDirection3(localToWorld, { x: 2, y: 3, z: 5 })
// position is approximately { x: 7, y: 22, z: 35 };
// direction is approximately { x: -3, y: 2, z: 5 }.
```

Matrices are column-major. `composeMat4(A, B, C)` computes `(A * B) * C`,
matching `transformation-matrix.compose`'s operation order: **C acts first**.
It does not mutate its inputs; one matrix produces a copy and no matrices
produces identity. Euler input is intrinsic, in degrees, and requires an explicit
order (`xyz`, `xzy`, `yxz`, `yzx`, `zxy`, or `zyx`). Point helpers apply an affine
matrix; they do not perform perspective projection. Directions are not
normalized and are not shading normals. Frames and units follow the supplied
matrix, never an implicit renderer convention.

**Legacy adapters use these primitives.** `transformPCBElement(s)` and
`transformSchematicElement(s)` lift their existing planar matrix once per
element/batch and use the shared mat4 point operation. The lift preserves XY
shear, reflections, singular maps, translation and Number precision; Z is
unchanged. `transformInsertionDirection` preserves its existing rounded
quarter-turn **rotation followed by Y reflection**, now composed as matrices.
The existing `rotateClockwise` and `rotateCounterClockwise` entry points now
convert their signed quarter-turn to a quaternion, then apply its mat4 to a
direction. `rotateDirection` retains the original clockwise-loop followed by
counterclockwise-loop sequence over those adapters, including fractional-count
behavior (`0.5` does not rotate, while `-0.5` rotates once counterclockwise).
CAD placement converts its Euler boundary through
`quaternionFromEulerDegrees(..., "xyz")`, and assembly frame composition uses
`composeMat4`.

| Existing operation | Matrix/quaternion execution | Preserved boundary behavior |
| --- | --- | --- |
| `rotateClockwise` / `rotateCounterClockwise` | `quat.fromEuler` with explicit `xyz`, then `mat4.fromQuat` and direction application | Respectively -90 / +90 degrees about Z; unit cardinal classification. |
| `rotateDirection` | Ordered calls to the two quarter-turn adapters | The original two-loop sequence, not newly rounded/truncated total angles. |
| `transformInsertionDirection` | `Fy * Rz` on native XY insertion vectors | Round to nearest quarter-turn first, rotate, then reflect Y; retain Z insertion layer handling. |
| `transformPCBElement(s)` / `transformSchematicElement(s)` | Lift the supplied planar matrix, then apply the mat4 to points | Original element mutation, dimension and orientation metadata behavior. |
| `getCadModelPlacement`'s Euler boundary | Explicit `xyz` quaternion followed by pose/model mat4 composition | Full native-to-world transform and origin/fit order, without Euler decomposition. |

The planar adapters still use the existing `decomposeTSR` interpretation for
legacy rotation/reflection metadata and dimension swapping, not gl-matrix
decomposition. Its documented order is `T * S * R`
(`transformation-matrix/src/decompose.js`); replacing it with another
decomposition changes reflection/shear interpretation. Schematic facing-direction
behavior and the distinction between
single-element and batch pad-dimension handling remain unchanged. Planar edits
still move CAD XY without changing CAD Z/orientation. These compatibility rules
do not redefine model-to-world normalization.
Outline-shaped keepouts from newer circuit-json peers transform their outline
points through the same mat4 path; centered keepout behavior is unchanged.

## CAD placement (3D)

`getCadModelPlacement(cad, options)` is a pure, renderer-independent boundary
from native asset coordinates to **right-handed Circuit JSON Z-up world, mm**.
It does not load assets, infer geometry from PCB pads, mutate circuit elements,
or choose per-format compensations. The existing `transformPCBElement` and
`repositionPcbComponentTo` are planar editing helpers, not model normalization.

```ts
import { getCadModelPlacement } from "@tscircuit/circuit-json-util"
import { mat4, vec3 } from "gl-matrix"

const placement = getCadModelPlacement(
  {
    position: { x: 10, y: 20, z: 1.6 },
    rotation: { x: 0, y: 0, z: 90 },
    model_board_normal_direction: "y+",
    model_origin_position: { x: 0, y: 0, z: 0 },
    size: { x: 6, y: 4, z: 20 },
  },
  {
    nativeBounds: {
      min: { x: -3, y: -2, z: 0 },
      max: { x: 3, y: 2, z: 20 },
    },
    nativeToCanonicalModel: mat4.create(),
    sizeSpace: "native",
  },
)
const worldVertex = vec3.transformMat4(
  vec3.create(),
  [3, 2, 20],
  placement.nativeToWorld,
)
```

**Adapter contract.** Supply measured `nativeBounds` and an explicit,
column-major `nativeToCanonicalModel` affine mat4. The latter captures loader
axis/origin/node transforms exactly once; an identity matrix is an explicit
choice. A negative determinant is accepted and preserved, never decomposed into
a quaternion or silently "fixed". Adapters own triangle winding/shading changes
for reflected geometry, native format defaults, and world-to-renderer conversion.
Do not pass already-normalized vertices together with their original loader map.
`model_unit_to_mm_scale_factor` is applied separately (default 1); do not include
the same unit conversion twice.
For example, a native unit cube with unit scale 2 becomes a 2 mm cube without
a target size, but fitting it to a declared 1 mm size produces a 1 mm cube.
The target is already in millimeters and is not multiplied by the unit scale.

The placement implementation also exposes its actual primitives, rather than
requiring adapters to run dummy-bound placements:
`getCadModelBoardNormalQuaternion(direction = "z+", nativeToCanonicalModel = identity)`
and `getCadModelFitScaleFromBounds(bounds, targetSize, fitMode = "contain_within_bounds")`.
The former returns a double-precision quaternion; the latter requires bounds and
target in the same axes/units and returns dimensionless `Point3` scales.
`getCadModelPlacement` calls these same functions. Normal-to-matrix conversion
is simply `mat4.fromQuat(out, quaternion)`. Legacy wrappers retain their own
documented defaults at the boundary, including missing-origin conventions and
any different flat-axis fitting policy; no fabricated contact point is inferred.

The native `model_board_normal_direction` (default `z+`) is an **up direction**,
not a shading normal. Its linear loader transform excludes translation and is
aligned to +Z with a quaternion. The exact antiparallel case uses an X-axis
half-turn to preserve the established roll. CAD `rotation` is intrinsic XYZ in
degrees, converted once to a quaternion. It is the **complete world pose**:
the adapter must resolve any legacy bottom-layer/thickness convention before
calling this utility. No layer-dependent mirroring or Z relocation is inferred.

**Size and origin.** With `cad.size`, `sizeSpace` is mandatory: `"native"` fits
target mm dimensions along native axes before loader/normal alignment, while
`"board"` fits in board-aligned model axes before CAD world rotation. Thus a
native-size 6x4x20 model with a +Y normal becomes 6x20x4, not 6x4x20.
`fill_bounds` uses per-axis scales; `contain_within_bounds` (default) uses the
smallest positive-extent ratio. Flat axes do not limit containment, but filling
a zero-extent axis throws. No size means no fitting. All fit bounds are measured
native envelopes mapped into the chosen space; arbitrary non-axis-aligned loader
maps can conservatively enlarge that envelope.

An explicit `model_origin_position` takes precedence and is a point in native
asset coordinates. Otherwise `model_origin_alignment`, then `anchor_alignment`,
selects an origin. `center` uses the measured envelope center;
`bottom_center_of_component` uses its board-aligned bottom center;
`center_of_component_on_board_surface` requires an adapter-measured native
`boardContactPoint` rather than guessing a contact patch from the envelope.
Unknown or absent alignment preserves native zero. The selected origin goes
through **the same loader, units, normal and fit** as geometry, then maps to
`cad.position`. Returned `origin` records its provenance and native,
canonical-model (before units/fit), and world point coordinates.

**One matrix for geometry and its bounds.** Apply `nativeToWorld` identically to
the actual model's vertices or JSCAD solid and any body-envelope corners.
`worldBounds` is the conservative envelope of the transformed native box,
calculated in one pass; it is **not collision geometry**. Use an available exact
solid for collision and measure that transformed solid when tight world bounds
are required. `modelNormalWorld` is a normalized direction, excluding translation.
Inputs are not mutated; nonfinite, singular or projective matrices throw.

Supply `boardToWorld` to also get
`nativeToBoard = inverse(boardToWorld) * nativeToWorld`. For assembly mating,
`composeCadAssemblyPlacement({ targetToWorld, datumToModel })` returns
`targetToWorld * inverse(datumToModel)`, so the model-local datum, not its raw
origin, lands on the target. Compose additional frames as matrices; do not
extract/reconstruct Euler angles.

Reusable exported types are `CadModelPlacementFields`, `CadModelPlacementOptions`,
`CadModelPlacement`, `CadModelBounds`, `CadModelOrigin`, and
`CadAssemblyPlacementOptions`. Their frame/unit contracts are documented at the
declarations. The reference implementations examined were
`3d-viewer/src/utils/cad-model-transform.ts` and
`cad-model-loader-transform.ts` (unified transform graph, commit `11b060e`),
plus `circuit-json-to-gltf/lib/utils/cad-mesh-placement.ts` (explicit origin fix
`df7a83a`, inferred contact fix `b95c789`) and `get-default-model-transform.ts`.
Those adapters disagree on format compensations; this API deliberately does not
copy their tables or treat their legacy inferred contact fallback as measurement.

## Standard Usage

```ts
import { su } from "@tscircuit/circuit-json-util"

const circuitJson = [
  /* [ { type: "source_component", ... }, ... ] */
]

const pcb_component = su(circuitJson).pcb_component.get("1234")

const source_component = su(circuitJson).source_component.getUsing({
  pcb_component_id: "123",
})

const schematic_component = su(circuitJson).schematic_component.getWhere({
  width: 1,
})

const source_traces = su(circuitJson).source_trace.list({
  source_component_id: "123",
})
```

## Optimized Indexed Version

For large circuit json, the library provides an optimized version with indexing for faster lookups:

```ts
import { suIndexed } from "@tscircuit/circuit-json-util"

const circuitJson = [
  /* large soup with many elements */
]

// Configure the indexes you want to use
const indexedSu = suIndexed(circuitJson, {
  indexConfig: {
    byId: true, // Index by element ID for fast .get() operations
    byType: true, // Index by element type for fast .list() operations
    byRelation: true, // Index relation fields (fields ending with _id)
    bySubcircuit: true, // Index by subcircuit_id for fast subcircuit filtering
    byCustomField: ["name", "ftype"], // Index specific fields you query often
  },
})

// Use the same API as the standard version, but with much better performance
const pcb_component = indexedSu.pcb_component.get("1234") // O(1) lookup

// Fast filtering by subcircuit
const subcircuitElements = indexedSu.source_component.list({
  subcircuit_id: "main",
})
```

The indexed version maintains the same API as the standard version but provides significant performance improvements, especially for large circuit json arrays.


## Categorize DRC Errors and Warnings

Use `categorizeErrorOrWarning` to map DRC result types to high-level check categories.

```ts
import { categorizeErrorOrWarning } from "@tscircuit/circuit-json-util"

categorizeErrorOrWarning("source_pin_must_be_connected_error") // "netlist"
categorizeErrorOrWarning("source_property_ignored_warning") // "source"
categorizeErrorOrWarning("source_no_power_pin_defined_warning") // "pin_specification"
categorizeErrorOrWarning({ error_type: "pcb_trace_error" }) // "routing"
categorizeErrorOrWarning({
  warning_type: "pcb_connector_not_in_accessible_orientation_warning",
}) // "placement"
categorizeErrorOrWarning("some_future_error_type") // "unknown"
```


## Repositioning PCB Components

Use `repositionPcbComponentTo` to move a component and all of its related elements to a new center:

```ts
import { repositionPcbComponentTo } from "@tscircuit/circuit-json-util"

repositionPcbComponentTo(circuitJson, "pc1", { x: 10, y: 5 })
```

All ports, pads and traces referencing the component are translated by the same offset.

Use `repositionSchematicComponentTo` to move a schematic component and all related elements:

```ts
import { repositionSchematicComponentTo } from "@tscircuit/circuit-json-util"

repositionSchematicComponentTo(circuitJson, "sc1", { x: 10, y: 5 })
```

Move all elements in a schematic source group with `repositionSchematicGroupTo`:

```ts
import { repositionSchematicGroupTo } from "@tscircuit/circuit-json-util"

repositionSchematicGroupTo(circuitJson, "g1", { x: 20, y: 15 })
```



## Compute Copper Gap

Use `computeGapBetweenCopper` to calculate the minimum copper clearance between two PCB elements.

It decomposes each element into primitive shapes (`circle`, `rect`, `polygon`) and returns the minimum distance across all shape-pair combinations. If an element does not produce any supported copper shapes, the function returns `Infinity`.

```ts
import { computeGapBetweenCopper } from "@tscircuit/circuit-json-util"

const gap = computeGapBetweenCopper(
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pad1",
    shape: "circle",
    x: 0,
    y: 0,
    radius: 0.5,
    layer: "top",
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pad2",
    shape: "rect",
    x: 2,
    y: 0,
    width: 1,
    height: 1,
    layer: "top",
  },
)

console.log(gap) // 1
```

Currently supported decomposition targets include `pcb_smtpad` (circle/rect/polygon), `pcb_trace` wire segments, `pcb_via`, and `pcb_plated_hole`.
