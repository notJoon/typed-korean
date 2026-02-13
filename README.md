# typed-korean

Type-level Korean grammar validation using TypeScript's type system.

Inspired by [typed-japanese](https://github.com/typedgrammar/typed-japanese), this project explores representing Korean grammatical rules as TypeScript types. If a sentence is grammatically correct, it type-checks. If it violates a rule, the compiler reports an error.

Korean, like Japanese, is an agglutinative language, so the approach maps naturally. However, Korean introduces additional challenges: vowel harmony (모음조화), vowel contraction (모음 축약), multiple irregular conjugation classes, and the combinatorial structure of Hangul in Unicode.

## Goals

- Express Korean verb and adjective conjugation at the type level, including regular and irregular patterns.
- Select allomorphic particles (은/는, 이/가, 을/를, etc.) based on the presence of a final consonant (batchim).
- Assemble validated Korean sentences from typed components, where the compiler ensures grammatical agreement.

This is a concept exploration, not a production tool. The aim is to push the boundaries of what TypeScript's type system can express, using Korean grammar as the domain.

## Scope

**Covered:**

- Regular and irregular verb/adjective conjugation (ㅂ, ㄷ, ㅅ, ㅎ, 르, ㅡ, 하다)
- Vowel harmony and vowel contraction
- Batchim-based particle selection
- Basic sentence structure (subject-object-predicate)
- Compound sentences via connective endings

**Not covered:**

- Arbitrary Korean text validation or natural language parsing
- Middle Korean, archaic forms, or dialectal variation
- Runtime functionality (this is a purely type-level library)

## Setup

Requires Node.js 18+ and TypeScript 5.5+.

```sh
npm install
npm run codegen    # generate Hangul lookup tables
npm run typecheck  # verify types
npm run test       # run type-level tests
npm run format     # format with prettier
```

The codegen step generates pre-computed Hangul decomposition and composition tables under `src/generated/`. These files are committed to version control. When vocabulary entries are added or modified in `scripts/vocabulary.ts`, re-run `npm run codegen` to regenerate the tables.

## License

MIT
