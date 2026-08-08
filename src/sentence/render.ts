import type { SentenceShape } from "./shape.js";

type Words<
  Parts extends readonly (string | undefined)[],
  Result extends string = "",
> = Parts extends readonly [
  infer Head extends string | undefined,
  ...infer Tail extends (string | undefined)[],
]
  ? Words<
      Tail,
      Head extends string
        ? Result extends ""
          ? Head
          : `${Result} ${Head}`
        : Result
    >
  : Result;

type Slot<Shape, Key extends PropertyKey> = Key extends keyof Shape
  ? Shape[Key]
  : undefined;

/**
 * Renders a structured sentence in canonical SOV order.
 *
 * @example
 * ```ts
 * type Result = Render<{ subject: "나는"; object: "밥을"; predicate: "먹었다" }>;
 * //   ^? "나는 밥을 먹었다"
 * ```
 */
export type Render<Shape extends SentenceShape> = Words<
  [
    Slot<Shape, "subject">,
    Slot<Shape, "time">,
    Slot<Shape, "locFrom">,
    Slot<Shape, "locTo">,
    Slot<Shape, "object">,
    Slot<Shape, "manner">,
    Slot<Shape, "cause">,
    Shape["predicate"],
  ]
>;
