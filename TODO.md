# typed-korean 구현 태스크

## Phase 0: 프로젝트 초기 설정

- [x] **0.1** TypeScript 프로젝트 초기화 (`package.json`, `tsconfig.json`)
  - TypeScript 5.5+ 설정, `strict: true`, `noEmit: true`
  - `"moduleResolution": "bundler"` 또는 `"node16"`
  - 경로 별칭 설정 (`src/*`)
- [x] **0.2** 디렉토리 구조 생성
  - `src/generated/` — 코드젠 출력
  - `scripts/` — 코드젠 스크립트
  - `tests/` — 타입 테스트
- [x] **0.3** 타입 테스트 도구 설정
  - `vitest` + `@type-challenges/utils` 또는 `tsd` 등 타입 레벨 테스트 방법 결정 및 설정
  - `npm run typecheck` 스크립트 추가
- [x] **0.4** 코드젠 실행 환경 설정
  - `tsx` 또는 `ts-node` 설치
  - `npm run codegen` 스크립트 추가

---

## Phase 1: 한글 유니코드 유틸리티 (`hangul-unicode`)

### 코드젠 스크립트

- [x] **1.1** `scripts/gen-jamo-table.ts` 작성 — JamoTable 생성
  - 유니코드 상수 정의 (`SBase=0xAC00`, `LBase`, `VBase`, `TBase`, 개수 상수)
  - 분해 공식 구현: 음절 → 초/중/종성 인덱스 → 호환 자모 매핑
  - 출력: `src/generated/jamo-table.gen.ts`
    - `type OpenSyllable = "가" | "개" | ... | "히"` (399개, 받침 없는 음절)
    - `type JamoTable = { "가": { 초: "ㄱ"; 중: "ㅏ"; 종: null }; ... }` (어휘 주도, 최소 범위)
  - JamoTable 수집 범위: 어간/altStem 마지막 글자 + 르 불규칙은 끝에서 두 번째 글자
- [x] **1.2** `scripts/gen-jamo-table.ts` 확장 — ComposeTable 생성
  - `(초성, 중성, 종성|null) → 완성형 음절` 매핑 생성
  - 키 형식: `"ㄱ_ㅏ"` → `"가"`, `"ㄱ_ㅏ_ㄱ"` → `"각"`
  - 어휘 주도 생성 (`src/generated/compose-table.gen.ts`에 출력)
- [x] **1.3** 코드젠 실행 및 결과 검증
  - `npm run codegen` 실행하여 `.gen.ts` 파일 생성
  - 생성된 파일이 정상 컴파일되는지 확인

### 유틸리티 타입

- [x] **1.4** `src/hangul-unicode/string-utils.ts` — 문자열 유틸리티 타입
  - `LastChar<S>`: 문자열의 마지막 글자 추출 (재귀 구현)
  - `DropLast<S>`: 마지막 글자를 제거한 문자열 반환
  - `IfLiteral<S, Then, Else>`: 리터럴 게이트 (넓은 `string` 타입 차단)
- [x] **1.5** `src/hangul-unicode/jamo.ts` — 자모 유틸리티 타입
  - `HasBatchim<S>`: 마지막 글자의 받침 유무 (`LastChar<S> extends OpenSyllable ? false : true`)
  - `LastVowel<S>`: 마지막 글자의 중성 추출
  - `LastJong<S>`: 마지막 글자의 종성 추출
  - `SecondToLastVowel<S>`: 끝에서 두 번째 음절의 중성 (르 불규칙용)
  - `Compose<초, 중, 종>`: ComposeTable 룩업으로 음절 합성
- [x] **1.6** `hangul-unicode` 타입 테스트 작성
  - `HasBatchim<"밥">` → `true`, `HasBatchim<"사과">` → `false`
  - `LastVowel<"먹">` → `"ㅓ"`, `LastVowel<"가">` → `"ㅏ"`
  - `Compose<"ㅇ", "ㅘ", null>` → `"와"`, `Compose<"ㅆ", "ㅓ", null>` → `"써"`
  - `LastChar<"먹다">` → `"다"`, `DropLast<"먹다">` → `"먹"`
  - 리터럴 게이트가 넓은 `string`을 차단하는지 확인

---

## Phase 2: 규칙 동사 활용 (`vocabulary`, `conjugation`)

### 어휘 인터페이스 (`vocabulary`)

- [x] **2.1** `src/vocabulary/verb.ts` — 동사 인터페이스 정의
  - `Verb` 기본 인터페이스 (`stem`, `ending: "다"`)
  - `RegularVerb` (규칙 동사, `irregularType?: never`)
  - `IrregularType` 유니온 (`"ㅂ" | "ㄷ" | "ㅅ" | "ㅎ" | "르" | "ㅡ" | "러"`)
  - `IrregularVerb<Type>` (`altStem` 포함)
  - `하다Verb` (`prefix` 포함)
- [x] **2.2** `src/vocabulary/adjective.ts` — 형용사 인터페이스 정의
  - `Adjective` (Verb 확장, `partOfSpeech: "adjective"`)
- [x] **2.3** `src/vocabulary/noun.ts` — 명사 인터페이스 정의
  - `Noun<W>`, `ProperNoun<W>`
- [x] **2.4** `src/vocabulary/entries.ts` — 규칙 동사 어휘 선언 (10개)
  - 먹다, 가다, 보다, 살다, 오다, 주다, 쓰다, 마시다, 읽다, 잡다

### 활용 엔진 — 규칙 동사 (`conjugation`)

- [x] **2.5** `src/conjugation/ending-types.ts` — 활용형/어미 타입 정의
  - `EndingType` 유니온: `"해요체"`, `"과거_평서"`, `"합쇼체"`, `"평서_현재"`, `"고"`, `"아서"`, `"면"`, `"지만"` 등
  - `VowelStartingEnding` / `ConsonantStartingEnding` 분류
- [x] **2.6** `src/conjugation/vowel-harmony.ts` — 모음조화
  - `양성모음` 유니온 (`"ㅏ" | "ㅗ" | "ㅑ" | "ㅛ"`)
  - `아어<Stem>`: 어간 말 모음에 따라 `"아"` / `"어"` 결정
- [x] **2.7** `src/conjugation/contraction.ts` — 모음 축약
  - `Contract<StemVowel, EndingVowel>`: 축약 규칙 테이블
    - ㅏ+ㅏ→ㅏ, ㅗ+ㅏ→ㅘ, ㅜ+ㅓ→ㅝ, ㅡ+ㅓ→ㅓ, ㅣ+ㅓ→ㅕ, ㅐ+ㅓ→ㅐ
  - `ApplyContraction<Stem, EndingVowel>`: 축약 결과를 음절로 재합성
    - Compose를 사용하여 초성 유지 + 중성 교체
- [x] **2.8** `src/conjugation/conjugate.ts` — 활용 파이프라인 (규칙 동사)
  - `EffectiveStem<V, F>`: 어미 유형에 따른 어간 선택
  - 자음 어미 결합: stem + "고", stem + "지만" 등 단순 이어붙임
  - 모음 어미 결합:
    - 받침 있는 어간 → 그냥 이어붙임 ("먹" + "어" → "먹어")
    - 받침 없는 어간 → 축약 적용 ("가" + "아" → "가")
  - 해요체: 축약 결과 + "요"
  - 합쇼체: 받침 유무 → "습니다" / "ㅂ니다" (종성 ㅂ 삽입 + Compose)
  - 평서 현재: "는다" / "ㄴ다" (받침 유무 기반)
  - 과거: stem + 았/었 처리
  - 조건 (-면): 받침 유무 → "으면" / "면"
- [x] **2.9** Phase 2 타입 테스트 작성
  - `Conjugate<먹다, "해요체">` → `"먹어요"`
  - `Conjugate<가다, "해요체">` → `"가요"` (ㅏ+ㅏ 축약)
  - `Conjugate<오다, "해요체">` → `"와요"` (ㅗ+ㅏ→ㅘ 축약)
  - `Conjugate<보다, "과거_평서">` → `"봤다"` (ㅗ+ㅏ→ㅘ + ㅆ)
  - `Conjugate<먹다, "합쇼체">` → `"먹습니다"`
  - `Conjugate<가다, "합쇼체">` → `"갑니다"`
  - `Conjugate<먹다, "고">` → `"먹고"`
  - `Conjugate<먹다, "면">` → `"먹으면"`
  - `Conjugate<가다, "면">` → `"가면"`
  - `Conjugate<먹다, "평서_현재">` → `"먹는다"`
  - `Conjugate<가다, "평서_현재">` → `"간다"`
  - `Conjugate<주다, "해요체">` → `"줘요"` (ㅜ+ㅓ→ㅝ)
  - `Conjugate<쓰다, "해요체">` → `"써요"` (ㅡ탈락)
  - `Conjugate<마시다, "해요체">` → `"마셔요"` (ㅣ+ㅓ→ㅕ)

---

## Phase 3: 불규칙 동사 및 하다 동사 (`vocabulary`, `conjugation`)

- [ ] **3.1** `src/vocabulary/entries.ts` 확장 — 불규칙 동사 어휘 선언
  - ㅂ 불규칙: 덥다, 춥다, 아름답다
  - ㄷ 불규칙: 듣다, 걷다
  - ㅅ 불규칙: 짓다, 낫다
  - 르 불규칙: 모르다, 빠르다
  - ㅎ 불규칙: 그렇다, 어떻다
  - 하다 동사: 공부하다, 운동하다
  - 불규칙 형용사: 가깝다
- [ ] **3.2** `src/conjugation/conjugate.ts` 확장 — 불규칙 활용 처리
  - `EffectiveStem`이 모음 어미에서 `altStem`을 반환하도록 구현
  - 불규칙 어간(`altStem`)에도 모음조화/축약이 정상 적용되는지 확인
- [ ] **3.3** `src/conjugation/conjugate.ts` 확장 — 르 불규칙 특수 처리
  - `르아어<Stem>`: 끝에서 두 번째 음절 모음으로 모음조화 판단
  - altStem(예: "몰") + "라"/"러" 결합
- [ ] **3.4** `src/conjugation/conjugate.ts` 확장 — 하다 동사 특수 활용
  - 모음 어미: "하" + "여" → "해" 축약 (prefix + "해요", prefix + "했다" 등)
  - 자음 어미: prefix + "하고", prefix + "하지만" 등 정상 결합
- [ ] **3.5** Phase 3 타입 테스트 작성
  - ㅂ 불규칙: `Conjugate<덥다, "해요체">` → `"더워요"`
  - ㄷ 불규칙: `Conjugate<듣다, "과거_평서">` → `"들었다"`
  - ㅅ 불규칙: `Conjugate<짓다, "해요체">` → `"지어요"`
  - 르 불규칙: `Conjugate<모르다, "해요체">` → `"몰라요"`
  - ㅎ 불규칙: `Conjugate<그렇다, "해요체">` → `"그래요"`
  - 하다 동사: `Conjugate<공부하다, "해요체">` → `"공부해요"`
  - 하다 과거: `Conjugate<공부하다, "과거_평서">` → `"공부했다"`
  - 자음 어미: `Conjugate<덥다, "고">` → `"덥고"` (원래 stem 유지)

---

## Phase 4: 조사 시스템 및 문장 조립 (`particles`, `sentence`)

### 조사 시스템 (`particles`)

- [ ] **4.1** `src/particles/particles.ts` — 조사 선택 타입
  - `ParticleRole`: `"topic" | "subject" | "object" | "with" | "direction"`
  - `은는<N>`, `이가<N>`, `을를<N>`, `과와<N>`: HasBatchim 기반 선택
  - `으로로<N>`: ㄹ받침 예외 처리 (`종성이 "ㄹ"이면 "로"`)
  - `SelectParticle<N, Role>`: 역할별 조사 통합 선택
- [ ] **4.2** `src/particles/noun-phrase.ts` — 명사구 생성
  - `NounWithParticle<N, Role>`: `${N["word"]}${SelectParticle<N, Role>}`

### 문장 조립 (`sentence`)

- [ ] **4.3** `src/sentence/sentence.ts` — 문장 구조 타입
  - `Statement<Subj, Obj, Pred>`: SOV 문장 (`${Subj} ${Obj} ${Pred}`)
  - `IntransitiveStatement<Subj, Pred>`: 자동사 문장 (`${Subj} ${Pred}`)
  - `ConnectedSentence<Clause1, Clause2>`: 복합문
  - `ConnectiveClause<Subj, Pred>`: 연결절

### 테스트

- [ ] **4.4** Phase 4 타입 테스트 작성
  - 조사 선택: `은는<Noun<"밥">>` → `"은"`, `은는<Noun<"사과">>` → `"는"`
  - 조사 선택: `을를<Noun<"밥">>` → `"을"`, `을를<Noun<"사과">>` → `"를"`
  - ㄹ받침 예외: `으로로<Noun<"서울">>` → `"로"`
  - 명사구: `NounWithParticle<Noun<"나">, "topic">` → `"나는"`
  - 명사구: `NounWithParticle<Noun<"밥">, "object">` → `"밥을"`
  - 문장 조립: `Statement<"나는", "밥을", "먹었다">` → `"나는 밥을 먹었다"`
  - 통합 테스트: Statement + NounWithParticle + Conjugate 조합
    - `Statement<NounWithParticle<Noun<"나">, "topic">, NounWithParticle<Noun<"밥">, "object">, Conjugate<먹다, "과거_평서">>` → `"나는 밥을 먹었다"`

---

## Phase 5: 확장 및 마무리

- [ ] **5.1** 연결어미 복합문 예시 구성
  - "비가 오고 바람이 분다" 등 복합문 타입 조합 테스트
- [ ] **5.2** 추가 어휘 확장
  - 자주 쓰이는 동사/형용사/명사 추가 등록
- [ ] **5.3** 성능 벤치마크
  - `tsc --noEmit --extendedDiagnostics`로 check time, memory 측정
  - 동사 10개 × 활용형 5개 = 50개 타입 평가 기준
  - 문장 10개 조립 기준
- [ ] **5.4** 공개 API 정리 및 `src/index.ts` 작성
  - 최종 export 구조 정리
- [ ] **5.5** README.md 작성
  - 프로젝트 소개, 사용 예시, 설치/빌드 방법
