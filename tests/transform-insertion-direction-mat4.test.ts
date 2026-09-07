import { expect, test } from "bun:test"
import { transformInsertionDirection } from "../index"

test("legacy insertion rounding and rotate-then-reflect semantics survive quaternion conversion", () => {
  const cases = [
    { degrees: 44, direction: "from_right" },
    { degrees: 45, direction: "from_bottom" },
    { degrees: 46, direction: "from_bottom" },
    { degrees: 90, direction: "from_bottom" },
    { degrees: 180, direction: "from_left" },
    { degrees: 270, direction: "from_top" },
    { degrees: -45, direction: "from_right" },
    { degrees: -46, direction: "from_top" },
    { degrees: -90, direction: "from_top" },
  ] as const
  for (const { degrees, direction } of cases) {
    expect(
      transformInsertionDirection("from_right", {
        rotationDegrees: degrees,
        isFlipped: true,
      }),
    ).toBe(direction)
  }
  expect(
    transformInsertionDirection("from_above", {
      rotationDegrees: 90,
      isFlipped: true,
    }),
  ).toBe("from_below")
  expect(
    transformInsertionDirection("from_below", {
      rotationDegrees: 90,
      isFlipped: false,
    }),
  ).toBe("from_below")
  expect(
    transformInsertionDirection(undefined, {
      rotationDegrees: 90,
      isFlipped: true,
    }),
  ).toBeUndefined()
})
