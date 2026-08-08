/**
 * Joins two rendered sentence fragments with a space.
 *
 * @example
 * ```ts
 * type Result = Join<"비가 오고", "바람이 분다">;
 * //   ^? "비가 오고 바람이 분다"
 * ```
 */
export type Join<A extends string, B extends string> = `${A} ${B}`;

/**
 * Describes a transitive statement without discarding its semantic roles.
 *
 * @example
 * ```ts
 * type Result = Render<Statement<"나는", "밥을", "먹었다">>;
 * //   ^? "나는 밥을 먹었다"
 * ```
 */
export type Statement<
  Subj extends string,
  Obj extends string,
  Pred extends string,
> = { subject: Subj; object: Obj; predicate: Pred };

/**
 * Describes an intransitive statement without discarding its subject role.
 *
 * @example
 * ```ts
 * type Result = Render<IntransitiveStatement<"비가", "온다">>;
 * //   ^? "비가 온다"
 * ```
 */
export type IntransitiveStatement<Subj extends string, Pred extends string> = {
  subject: Subj;
  predicate: Pred;
};

/**
 * Describes an adjective-predicate statement with its subject role intact.
 *
 * @example
 * ```ts
 * type Result = Render<DescriptiveStatement<"날씨가", "덥다">>;
 * //   ^? "날씨가 덥다"
 * ```
 */
export type DescriptiveStatement<Subj extends string, Pred extends string> = {
  subject: Subj;
  predicate: Pred;
};
