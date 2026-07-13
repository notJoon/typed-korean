/**
 * Basic SOV sentence assembly.
 *
 * - `Statement` — SOV
 * - `IntransitiveStatement` — SV
 * - `DescriptiveStatement` — subject + adjective predicate
 *
 * Uses plain strings for easy composition.
 */

export type Join<A extends string, B extends string> = `${A} ${B}`;

export type Statement<
  Subj extends string,
  Obj extends string,
  Pred extends string,
> = `${Subj} ${Obj} ${Pred}`;

export type IntransitiveStatement<
  Subj extends string,
  Pred extends string,
> = Join<Subj, Pred>;

export type DescriptiveStatement<
  Subj extends string,
  Pred extends string,
> = Join<Subj, Pred>;
