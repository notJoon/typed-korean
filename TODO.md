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

- [x] **3.1** `src/vocabulary/entries.ts` 확장 — 불규칙 동사 어휘 선언
  - ㅂ 불규칙: 덥다, 춥다, 아름답다
  - ㄷ 불규칙: 듣다, 걷다
  - ㅅ 불규칙: 짓다, 낫다
  - 르 불규칙: 모르다, 빠르다
  - ㅎ 불규칙: 그렇다, 어떻다
  - 하다 동사: 공부하다, 운동하다
  - 불규칙 형용사: 가깝다
- [x] **3.2** `src/conjugation/conjugate.ts` 확장 — 불규칙 활용 처리
  - `EffectiveStem`이 모음 어미에서 `altStem`을 반환하도록 구현
  - 불규칙 어간(`altStem`)에도 모음조화/축약이 정상 적용되는지 확인
- [x] **3.3** `src/conjugation/conjugate.ts` 확장 — 르 불규칙 특수 처리
  - `르아어<Stem>`: 끝에서 두 번째 음절 모음으로 모음조화 판단
  - altStem(예: "몰") + "라"/"러" 결합
- [x] **3.4** `src/conjugation/conjugate.ts` 확장 — 하다 동사 특수 활용
  - 모음 어미: "하" + "여" → "해" 축약 (prefix + "해요", prefix + "했다" 등)
  - 자음 어미: prefix + "하고", prefix + "하지만" 등 정상 결합
- [x] **3.5** Phase 3 타입 테스트 작성
  - ㅂ 불규칙: `Conjugate<덥다, "해요체">` → `"더워요"`
  - ㄷ 불규칙: `Conjugate<듣다, "과거_평서">` → `"들었다"`
  - ㅅ 불규칙: `Conjugate<짓다, "해요체">` → `"지어요"`
  - 르 불규칙: `Conjugate<모르다, "해요체">` → `"몰라요"`
  - ㅎ 불규칙: `Conjugate<그렇다, "해요체">` → `"그래요"`
  - 하다 동사: `Conjugate<공부하다, "해요체">` → `"공부해요"`
  - 하다 과거: `Conjugate<공부하다, "과거_평서">` → `"공부했다"`
  - 자음 어미: `Conjugate<덥다, "고">` → `"덥고"` (원래 stem 유지)

---

## Phase 3.5: 활용 엔진 버그 수정 및 보강

### 문법 정확성 수정

- [x] **3.6** 형용사 `평서_현재` 활용 수정 — 동사/형용사 분기 추가
  - 현재 동사·형용사 구분 없이 동일하게 `"는다"/"ㄴ다"`를 붙이고 있음
  - 한국어 형용사의 평서 현재는 `"어간+다"` (예: "덥다", "가깝다")
  - 동사만 `"는다"/"ㄴ다"` 사용 (예: "먹는다", "간다")
  - **통과 기준:**
    - `ConjugationMap` 또는 `PlainPresent`에서 `V extends Adjective` 분기 도입
    - `Conjugate<가깝다, "평서_현재">` → `"가깝다"` (altStem 사용 안 함, 원래 stem + 다)
    - `Conjugate<덥다, "평서_현재">` → `"덥다"` (기존 stem 유지)
    - `Conjugate<먹다, "평서_현재">` → `"먹는다"` (기존 동작 유지)
    - `Conjugate<가다, "평서_현재">` → `"간다"` (기존 동작 유지)

- [x] **3.7** ㄹ 탈락 불규칙 처리 — ㄴ/ㅂ/ㅅ 앞 ㄹ 탈락
  - `살다`(stem: "살")가 `RegularVerb`로 분류되어 ㄹ 탈락이 일어나지 않음
  - ㄹ 어간 동사는 ㄴ, ㅂ, ㅅ으로 시작하는 어미 앞에서 ㄹ이 탈락
  - **통과 기준:**
    - `Conjugate<살다, "평서_현재">` → `"산다"` (현재 오답: `"살는다"`)
    - `Conjugate<살다, "합쇼체">` → `"삽니다"` (ㄹ 탈락 후 ㅂ 삽입)
    - `Conjugate<살다, "해요체">` → `"살아요"` (모음 어미에서는 ㄹ 유지)
    - `Conjugate<살다, "고">` → `"살고"` (자음 어미에서는 ㄹ 유지)
    - 추가 어휘 `알다`, `만들다` 등으로도 동일 패턴 검증

- [x] **3.7.1** 불규칙 동사 `면` 활용 수정 — `-으면`의 `으`가 모음이므로 불규칙 교체 발생
  - `-으면`의 `으`는 삽입모음(epenthetic vowel)으로 모음 어미와 동일하게 불규칙 교체를 유발함
  - 현재 `면`이 `ConsonantStartingEnding`으로 분류되어 모든 불규칙 어간에서 altStem을 사용하지 않음
  - **통과 기준:**
    - ㅂ 불규칙: `Conjugate<덥다, "면">` → `"더우면"`, `Conjugate<가깝다, "면">` → `"가까우면"`
    - ㄷ 불규칙: `Conjugate<듣다, "면">` → `"들으면"`, `Conjugate<걷다, "면">` → `"걸으면"`
    - ㅅ 불규칙: `Conjugate<짓다, "면">` → `"지으면"`, `Conjugate<낫다, "면">` → `"나으면"`
    - ㅎ 불규칙: `Conjugate<그렇다, "면">` → `"그러면"`, `Conjugate<어떻다, "면">` → `"어떠면"`
    - 규칙 동사 기존 동작 유지: `"먹으면"`, `"가면"`, `"읽으면"` 등

- [x] **3.7.2** 형용사 미태깅 어휘 수정 — `Adjective` 태그 누락
  - `덥다`, `춥다`, `아름답다`, `그렇다`, `어떻다`, `빠르다`는 한국어에서 형용사이나 `Adjective` 태그 없음
  - `IrregularVerb<...>`만 부여되어 `평서_현재`가 동사처럼 `"는다"/"ㄴ다"` 형태로 처리됨
  - **통과 기준:**
    - 위 6개 어휘에 `Adjective &` 인터섹션 추가
    - `Conjugate<덥다, "평서_현재">` → `"덥다"` (현재 오답: `"덥는다"`)
    - `Conjugate<그렇다, "평서_현재">` → `"그렇다"` (현재 오답: `"그렇는다"`)
    - 3.6의 형용사 평서_현재 분기 구현이 선행되어야 함

### 미구현 불규칙 유형

- [x] **3.8** ㅡ 불규칙 정식 구현 — `IrregularVerb<"ㅡ">` 어휘 및 활용 로직
  - `IrregularType`에 `"ㅡ"`가 정의되어 있으나 해당 어휘와 전용 처리 로직 없음
  - 현재 `쓰다`는 `RegularVerb`로 분류되어 축약 규칙(`ㅡ_ㅓ → ㅓ`)에 의존
  - **통과 기준:**
    - `entries.ts`에 `IrregularVerb<"ㅡ">` 어휘 등록 (예: `끄다`, `뜨다`)
    - 또는 `쓰다`를 `RegularVerb`로 유지하되, `IrregularType`에서 `"ㅡ"` 제거하여 정합성 확보
    - 선택한 방향에 대한 판단 근거를 SPEC.md 또는 커밋 메시지에 기록
    - `Conjugate<끄다, "해요체">` → `"꺼요"` (ㅡ 탈락 + ㅓ) 또는 동등 검증

- [x] **3.9** 러 불규칙 구현 — `IrregularVerb<"러">` 어휘 및 활용 로직
  - `IrregularType`에 `"러"`가 정의되어 있으나 어휘·로직 모두 없음
  - 러 불규칙: 어간 끝 `르`가 모음 어미 앞에서 `르러`로 변환 (예: 이르다 → 이르러)
  - **통과 기준:**
    - `entries.ts`에 `이르다`(도착하다 의미), `푸르다` 등 러 불규칙 어휘 등록
    - `conjugate.ts`에 러 불규칙 전용 분기 추가
    - `Conjugate<이르다, "해요체">` → `"이르러요"`
    - `Conjugate<이르다, "과거_평서">` → `"이르렀다"`
    - `Conjugate<이르다, "고">` → `"이르고"` (자음 어미에서는 원래 stem)

### 축약 테이블 보강

- [ ] **3.10** `ContractionTable` 누락 규칙 추가
  - 현재 6개 규칙만 존재하며, 규칙에 없는 모음 조합이 오면 자모가 그대로 이어붙는 fallback 발생
  - **통과 기준:**
    - `ㅔ_ㅓ → ㅔ` 규칙 추가 (세다 → 세요, 베다 → 베요)
    - `ㅚ_ㅓ → ㅚ` 규칙 추가 (되다 → 돼요, 쇠다 → 쇠어요/쐬요)
    - 새 규칙에 대응하는 어휘를 `entries.ts`에 등록하고 테스트 추가
    - fallback 경로에 빠지는 어휘가 없는지 등록된 전체 어휘에 대해 검증

### 테스트 커버리지 강화

- [x] **3.11** 미테스트 어휘 전수 테스트 추가
  - 등록된 23개 어휘 × 8개 활용형 = 184 조합 중 약 45개(24%)만 테스트됨
  - 특히 `춥다`, `아름답다`, `걷다`, `낫다`, `빠르다`, `어떻다`, `운동하다` — 테스트 0건
  - **통과 기준:**
    - 모든 불규칙 유형별 최소 1개 어휘 × 전체 8개 활용형 테스트
    - `tests/conjugation.test-d.ts`에 불규칙 동사 자음 어미(`합쇼체`, `평서_현재`, `면`, `지만`) 테스트 추가
    - `운동하다` 최소 2개 활용형 테스트 (공부하다와 동일 패턴 확인)
    - 전체 테스트 커버리지 목표: 등록 어휘 × 활용형 조합의 50% 이상

---

## Phase 4: 조사 시스템 및 문장 조립 (`particles`, `phrase`)

### 4-A. 조사 선택 타입 (`particles`)

- [ ] **4.1** `src/particles/particle-types.ts` — 조사 역할 및 조사 쌍 정의
  - `ParticleRole` 유니온: `"topic" | "subject" | "object" | "instrument" | "direction" | "with" | "from" | "until" | "comparison"`
  - 각 역할에 대응하는 조사 쌍 타입 정의
    - `은/는` (topic), `이/가` (subject), `을/를` (object), `과/와` (with)
    - `으로/로` (instrument/direction), `에` (location — 받침 무관), `에서` (source — 받침 무관)
    - `부터` (from — 받침 무관), `까지` (until — 받침 무관), `보다` (comparison — 받침 무관)
  - **통과 기준:**
    - `ParticleRole` 유니온에 최소 9개 역할 포함
    - 받침 교체형(은/는, 이/가, 을/를, 과/와, 으로/로) 5쌍 + 고정형(에, 에서, 부터, 까지, 보다) 5개 정의

- [ ] **4.2** `src/particles/select-particle.ts` — `HasBatchim` 기반 조사 선택 엔진
  - `은는<W>`: `HasBatchim<W> extends true ? "은" : "는"`
  - `이가<W>`: `HasBatchim<W> extends true ? "이" : "가"`
  - `을를<W>`: `HasBatchim<W> extends true ? "을" : "를"`
  - `과와<W>`: `HasBatchim<W> extends true ? "과" : "와"`
  - `으로로<W>`: `LastJong<W> extends "ㄹ" ? "로" : HasBatchim<W> extends true ? "으로" : "로"`
    - ㄹ받침 예외 처리 필수 (서울 → "로", 부산 → "으로", 제주 → "로")
  - `SelectParticle<W, Role>`: 역할별 통합 선택 — 교체형은 위 타입 호출, 고정형은 직접 반환
  - **통과 기준:**
    - `은는<"밥">` → `"은"`, `은는<"사과">` → `"는"`
    - `을를<"밥">` → `"을"`, `을를<"사과">` → `"를"`
    - `과와<"밥">` → `"과"`, `과와<"사과">` → `"와"`
    - `으로로<"서울">` → `"로"` (ㄹ받침 예외)
    - `으로로<"부산">` → `"으로"` (일반 받침)
    - `으로로<"제주">` → `"로"` (받침 없음)
    - `SelectParticle<"밥", "topic">` → `"은"`, `SelectParticle<"밥", "until">` → `"까지"`

- [ ] **4.3** 조사 선택 타입 테스트 작성
  - `tests/particles.test-d.ts` 생성
  - 4.2의 모든 통과 기준을 타입 단언으로 작성
  - 리터럴 게이트 테스트: `은는<string>` → `never`
  - 겹받침 테스트: `을를<"닭">` → `"을"`, `으로로<"흙">` → `"으로"`
  - 코드젠 의존성 확인: 테스트에 필요한 음절이 JamoTable/OpenSyllable에 포함되는지 검증

### 4-B. 명사구 생성 (`phrase`)

- [ ] **4.4** `src/phrase/noun-phrase.ts` — 명사 + 조사 결합
  - `NounWithParticle<N, Role>`: `${N["word"]}${SelectParticle<N["word"], Role>}`
  - `NounPhrase<W, Role>`: `Noun<W>` 없이 문자열 직접 입력용 단축 타입
  - **통과 기준:**
    - `NounWithParticle<Noun<"나">, "topic">` → `"나는"`
    - `NounWithParticle<Noun<"밥">, "object">` → `"밥을"`
    - `NounWithParticle<Noun<"학교">, "direction">` → `"학교로"`
    - `NounWithParticle<Noun<"서울">, "instrument">` → `"서울로"` (ㄹ받침 예외)
    - `NounWithParticle<Noun<"친구">, "with">` → `"친구와"`
    - `NounWithParticle<Noun<"집">, "with">` → `"집과"`

- [ ] **4.5** `src/phrase/verb-phrase.ts` — 활용된 동사구
  - `VerbPhrase<V, F>`: `Conjugate<V, F>`를 감싸는 구문 단위 타입
  - 연결 어미 구문: `ConnectiveVerbPhrase<V, F>` — 고, 아서, 면, 지만 어미로 절을 생성
  - **통과 기준:**
    - `VerbPhrase<먹다, "해요체">` → `"먹어요"`
    - `ConnectiveVerbPhrase<먹다, "고">` → `"먹고"`

- [ ] **4.6** `src/phrase/adjective-phrase.ts` — 형용사구
  - `AdjectivePhrase<A, F>`: 형용사 활용 결과를 구문 단위로 감싸기
  - **통과 기준:**
    - `AdjectivePhrase<가깝다, "해요체">` → `"가까워요"`
    - `AdjectivePhrase<덥다, "평서_현재">` → `"덥다"`

### 4-C. 문장 조립 (`sentence`)

- [ ] **4.7** `src/sentence/sentence.ts` — 기본 문장 구조 타입
  - `Statement<Subj, Obj, Pred>`: SOV 타동사 문장 — `"${Subj} ${Obj} ${Pred}"`
  - `IntransitiveStatement<Subj, Pred>`: SV 자동사 문장 — `"${Subj} ${Pred}"`
  - `DescriptiveStatement<Subj, Pred>`: 주어 + 형용사 서술문 — `"${Subj} ${Pred}"`
  - **통과 기준:**
    - `Statement<"나는", "밥을", "먹었다">` → `"나는 밥을 먹었다"`
    - `IntransitiveStatement<"비가", "온다">` → `"비가 온다"`
    - `DescriptiveStatement<"날씨가", "덥다">` → `"날씨가 덥다"`

- [ ] **4.8** `src/sentence/compound.ts` — 복합문 및 연결절
  - `ConnectedSentence<Clause1, Clause2>`: 연결어미로 이어진 복합문
  - `ConditionalSentence<Cond, Result>`: 조건절(면) + 결과절
  - `ContrastSentence<A, B>`: 대조절(지만) + 후행절
  - **통과 기준:**
    - `ConnectedSentence<"비가 오고", "바람이 분다">` → `"비가 오고 바람이 분다"`
    - `ConditionalSentence<"비가 오면", "우산을 쓴다">` → `"비가 오면 우산을 쓴다"`
    - `ContrastSentence<"덥지만", "참을 만하다">` → `"덥지만 참을 만하다"`

- [ ] **4.9** `src/sentence/interrogative.ts` — 의문문
  - `Question<Body>`: 문장 끝에 `"?"` 또는 의문 종결 어미 추가
  - `WhQuestion<QWord, Body>`: 의문사(누가, 무엇을, 어디서, 언제, 왜, 어떻게) + 문장
  - **통과 기준:**
    - `Question<"밥을 먹었어요">` → `"밥을 먹었어요?"`
    - `WhQuestion<"어디서", "밥을 먹었어요">` → `"어디서 밥을 먹었어요?"`
    - `WhQuestion<"왜", "공부해요">` → `"왜 공부해요?"`

### 4-D. 통합 테스트

- [ ] **4.10** End-to-end 통합 테스트 — Noun + Particle + Conjugate + Sentence 조합
  - `tests/sentence.test-d.ts` 생성
  - **통과 기준 (최소 목표):**
    - SOV 완전체: `Statement<NounWithParticle<Noun<"나">, "topic">, NounWithParticle<Noun<"밥">, "object">, Conjugate<먹다, "과거_평서">>` → `"나는 밥을 먹었다"`
    - 자동사: `IntransitiveStatement<NounWithParticle<Noun<"비">, "subject">, Conjugate<오다, "해요체">>` → `"비가 와요"`
    - 형용사 서술: `DescriptiveStatement<NounWithParticle<Noun<"날씨">, "subject">, Conjugate<덥다, "해요체">>` → `"날씨가 더워요"`
    - 복합문: 연결어미(고) + 후행절 조합 — `"비가 오고 바람이 분다"`
    - 조건문: 조건절(면) + 결과절 조합 — `"비가 오면 우산을 쓴다"`
    - 의문문: `WhQuestion<"뭘", Statement<...>>` 형태

- [ ] **4.11** `src/index.ts` 업데이트 — Phase 4 공개 API export 추가
  - `SelectParticle`, `NounWithParticle`, `Statement`, `IntransitiveStatement` 등 export
  - 코드젠 재실행: 조사 테스트에 필요한 음절(닭, 흙 등)이 OpenSyllable/JamoTable에 포함되는지 확인

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
- [x] **5.4** 공개 API 정리 및 `src/index.ts` 작성
  - 최종 export 구조 정리
- [x] **5.5** README.md 작성
  - 프로젝트 소개, 사용 예시, 설치/빌드 방법
