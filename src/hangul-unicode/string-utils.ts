/**
 * Extract the last character of a string literal.
 *
 * Uses recursive template literal matching and returns `never` for `""`.
 *
 * @example
 * type A = LastChar<"먹다">; // "다"
 * type B = LastChar<"가">;   // "가"
 * type C = LastChar<"">;     // never
 */
export type LastChar<S extends string> = S extends `${infer _Head}${infer Tail}`
  ? Tail extends ""
    ? S
    : LastChar<Tail>
  : never;

/**
 * Remove the last character from a string literal.
 *
 * Returns `""` for empty string and single-character inputs.
 *
 * @example
 * type A = DropLast<"먹다">; // "먹"
 * type B = DropLast<"가">;   // ""
 * type C = DropLast<"">;     // ""
 */
export type DropLast<S extends string> = S extends `${infer Head}${infer Tail}`
  ? Tail extends ""
    ? ""
    : `${Head}${DropLast<Tail>}`
  : "";

/**
 * Literal-type gate utility.
 *
 * If `S` is a broad `string`, returns `Else`; otherwise returns `Then`.
 * Useful for preventing expensive or ambiguous evaluation on non-literal inputs.
 *
 * @example
 * type A = IfLiteral<"먹", 1, 2>; // 1
 * type B = IfLiteral<string, 1, 2>; // 2
 */
export type IfLiteral<S extends string, Then, Else> = string extends S
  ? Else
  : Then;
