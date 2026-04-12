/**
 * 활용(conjugation) 타입 테스트
 *
 * 모든 어휘 항목에 대해 주요 활용형 테스트 케이스 목록
 * - @ts-expect-error 가 붙은 테스트는 현재 오답을 내는 케이스.
 *   해당 버그가 수정되면 @ts-expect-error 를 제거하여 정상 단언으로 전환 필수.
 * - @ts-expect-error 가 없는 테스트는 현재 통과해야 하는 커버리지 케이스.
 *
 * NOTE: 테스트 케이스는 AI(Claude Opus 4)를 통해 생성되었기 때문에
 * 잘못된 케이스가 있을 수 있으며, 확인 후 수정이 필요합니다.
 */

import type { Conjugate } from "../src/conjugation/conjugate.js";
import type {
  가깝다,
  걷다,
  낫다,
  덥다,
  듣다,
  마시다,
  먹다,
  모르다,
  보다,
  빠르다,
  살다,
  쓰다,
  아름답다,
  어떻다,
  오다,
  운동하다,
  읽다,
  잡다,
  주다,
  짓다,
  춥다,
  그렇다,
  알다,
  만들다,
  끄다,
  이르다,
  푸르다,
  세다,
  되다,
  가다,
  공부하다,
} from "../src/vocabulary/entries.js";
import type { Equal, Expect } from "./test-utils.js";

// =============================================================================
// 1. 기본 규칙 동사 — 먹다, 가다
// =============================================================================

// 먹다 (RegularVerb, 자음 어간)
type _먹_해요 = Expect<Equal<Conjugate<먹다, "해요체">, "먹어요">>;
type _먹_과거 = Expect<Equal<Conjugate<먹다, "과거_평서">, "먹었다">>;
type _먹_합쇼 = Expect<Equal<Conjugate<먹다, "합쇼체">, "먹습니다">>;
type _먹_평서 = Expect<Equal<Conjugate<먹다, "평서_현재">, "먹는다">>;
type _먹_고 = Expect<Equal<Conjugate<먹다, "고">, "먹고">>;
type _먹_아서 = Expect<Equal<Conjugate<먹다, "아서">, "먹어서">>;
type _먹_면 = Expect<Equal<Conjugate<먹다, "면">, "먹으면">>;
type _먹_지만 = Expect<Equal<Conjugate<먹다, "지만">, "먹지만">>;

// 가다 (RegularVerb, 모음 어간)
type _가_해요 = Expect<Equal<Conjugate<가다, "해요체">, "가요">>;
type _가_과거 = Expect<Equal<Conjugate<가다, "과거_평서">, "갔다">>;
type _가_합쇼 = Expect<Equal<Conjugate<가다, "합쇼체">, "갑니다">>;
type _가_평서 = Expect<Equal<Conjugate<가다, "평서_현재">, "간다">>;
type _가_고 = Expect<Equal<Conjugate<가다, "고">, "가고">>;
type _가_아서 = Expect<Equal<Conjugate<가다, "아서">, "가서">>;
type _가_면 = Expect<Equal<Conjugate<가다, "면">, "가면">>;
type _가_지만 = Expect<Equal<Conjugate<가다, "지만">, "가지만">>;

// =============================================================================
// 2. 하다 동사 — 공부하다, 운동하다
// =============================================================================

// 공부하다
type _공부_해요 = Expect<Equal<Conjugate<공부하다, "해요체">, "공부해요">>;
type _공부_과거 = Expect<Equal<Conjugate<공부하다, "과거_평서">, "공부했다">>;
type _공부_합쇼 = Expect<Equal<Conjugate<공부하다, "합쇼체">, "공부합니다">>;
type _공부_평서 = Expect<Equal<Conjugate<공부하다, "평서_현재">, "공부한다">>;
type _공부_고 = Expect<Equal<Conjugate<공부하다, "고">, "공부하고">>;
type _공부_아서 = Expect<Equal<Conjugate<공부하다, "아서">, "공부해서">>;
type _공부_면 = Expect<Equal<Conjugate<공부하다, "면">, "공부하면">>;
type _공부_지만 = Expect<Equal<Conjugate<공부하다, "지만">, "공부하지만">>;

// =============================================================================
// 3. 형용사 평서_현재 — 형용사는 "어간+다" (동사의 "는다/ㄴ다"와 다름)
// =============================================================================

// 형용사: "가깝다"의 평서_현재는 "가깝다"여야 함
type _adj_plain1 = Expect<Equal<Conjugate<가깝다, "평서_현재">, "가깝다">>;

// =============================================================================
// 4. ㄹ 탈락 — ㄹ 어간 + ㄴ/ㅂ/ㅅ 어미 앞에서 ㄹ 탈락
// =============================================================================

// 살다 평서_현재: "산다" (ㄹ 탈락 후 ㄴ 결합)
type _ㄹ탈락_평서 = Expect<Equal<Conjugate<살다, "평서_현재">, "산다">>;

// 살다 합쇼체: "삽니다" (ㄹ 탈락 후 ㅂ 삽입)
type _ㄹ탈락_합쇼 = Expect<Equal<Conjugate<살다, "합쇼체">, "삽니다">>;

// 살다 면: "살면" (ㄹ 어간 뒤에는 으 삽입 없이 바로 -면)
type _ㄹ탈락_면 = Expect<Equal<Conjugate<살다, "면">, "살면">>;

// 알다: ㄹ 탈락
type _알_평서 = Expect<Equal<Conjugate<알다, "평서_현재">, "안다">>;
type _알_합쇼 = Expect<Equal<Conjugate<알다, "합쇼체">, "압니다">>;
type _알_면 = Expect<Equal<Conjugate<알다, "면">, "알면">>;
type _알_고 = Expect<Equal<Conjugate<알다, "고">, "알고">>;

// 만들다: ㄹ 탈락
type _만들_평서 = Expect<Equal<Conjugate<만들다, "평서_현재">, "만든다">>;
type _만들_합쇼 = Expect<Equal<Conjugate<만들다, "합쇼체">, "만듭니다">>;
type _만들_면 = Expect<Equal<Conjugate<만들다, "면">, "만들면">>;
type _만들_고 = Expect<Equal<Conjugate<만들다, "고">, "만들고">>;

// 살다: ㄹ 탈락이 일어나지 않는 어미 — 기존 동작 유지 확인
type _ㄹ유지_해요 = Expect<Equal<Conjugate<살다, "해요체">, "살아요">>;
type _ㄹ유지_과거 = Expect<Equal<Conjugate<살다, "과거_평서">, "살았다">>;
type _ㄹ유지_고 = Expect<Equal<Conjugate<살다, "고">, "살고">>;
type _ㄹ유지_아서 = Expect<Equal<Conjugate<살다, "아서">, "살아서">>;
type _ㄹ유지_지만 = Expect<Equal<Conjugate<살다, "지만">, "살지만">>;

// =============================================================================
// 5. ㅡ 탈락 — IrregularType에서 "ㅡ" 제거, RegularVerb로 처리
//
// ㅡ 탈락은 ContractionTable의 ㅡ_ㅓ → ㅓ 규칙으로 이미 처리됨.
// 별도의 IrregularVerb<"ㅡ"> 없이 RegularVerb로 정상 동작함.
// =============================================================================

// 끄다 (RegularVerb, stem: "끄") — ㅡ 탈락 검증
type _끄_해요 = Expect<Equal<Conjugate<끄다, "해요체">, "꺼요">>;
type _끄_과거 = Expect<Equal<Conjugate<끄다, "과거_평서">, "껐다">>;
type _끄_합쇼 = Expect<Equal<Conjugate<끄다, "합쇼체">, "끕니다">>;
type _끄_평서 = Expect<Equal<Conjugate<끄다, "평서_현재">, "끈다">>;
type _끄_고 = Expect<Equal<Conjugate<끄다, "고">, "끄고">>;
type _끄_면 = Expect<Equal<Conjugate<끄다, "면">, "끄면">>;

// =============================================================================
// 6. 러 불규칙 — 어간 불변, 연결모음 "러" 사용
// =============================================================================

// 이르다 (러 irregular, 동사)
type _이르_해요 = Expect<Equal<Conjugate<이르다, "해요체">, "이르러요">>;
type _이르_과거 = Expect<Equal<Conjugate<이르다, "과거_평서">, "이르렀다">>;
type _이르_합쇼 = Expect<Equal<Conjugate<이르다, "합쇼체">, "이릅니다">>;
type _이르_평서 = Expect<Equal<Conjugate<이르다, "평서_현재">, "이른다">>;
type _이르_고 = Expect<Equal<Conjugate<이르다, "고">, "이르고">>;
type _이르_아서 = Expect<Equal<Conjugate<이르다, "아서">, "이르러서">>;
type _이르_면 = Expect<Equal<Conjugate<이르다, "면">, "이르면">>;
type _이르_지만 = Expect<Equal<Conjugate<이르다, "지만">, "이르지만">>;

// 푸르다 (러 irregular, 형용사)
type _푸르_해요 = Expect<Equal<Conjugate<푸르다, "해요체">, "푸르러요">>;
type _푸르_과거 = Expect<Equal<Conjugate<푸르다, "과거_평서">, "푸르렀다">>;
type _푸르_평서 = Expect<Equal<Conjugate<푸르다, "평서_현재">, "푸르다">>;
type _푸르_고 = Expect<Equal<Conjugate<푸르다, "고">, "푸르고">>;

// =============================================================================
// 7. ContractionTable 보강 — ㅔ_ㅓ → ㅔ, ㅚ_ㅓ → ㅙ
// =============================================================================

// 세다 (ㅔ_ㅓ → ㅔ: 모음 흡수)
type _세_해요 = Expect<Equal<Conjugate<세다, "해요체">, "세요">>;
type _세_과거 = Expect<Equal<Conjugate<세다, "과거_평서">, "셌다">>;
type _세_합쇼 = Expect<Equal<Conjugate<세다, "합쇼체">, "셉니다">>;
type _세_평서 = Expect<Equal<Conjugate<세다, "평서_현재">, "센다">>;
type _세_고 = Expect<Equal<Conjugate<세다, "고">, "세고">>;
type _세_면 = Expect<Equal<Conjugate<세다, "면">, "세면">>;

// 되다 (ㅚ_ㅓ → ㅙ: 되 + 어 → 돼)
type _되_해요 = Expect<Equal<Conjugate<되다, "해요체">, "돼요">>;
type _되_과거 = Expect<Equal<Conjugate<되다, "과거_평서">, "됐다">>;
type _되_합쇼 = Expect<Equal<Conjugate<되다, "합쇼체">, "됩니다">>;
type _되_평서 = Expect<Equal<Conjugate<되다, "평서_현재">, "된다">>;
type _되_고 = Expect<Equal<Conjugate<되다, "고">, "되고">>;
type _되_면 = Expect<Equal<Conjugate<되다, "면">, "되면">>;

// =============================================================================
// 8. 미테스트 어휘 전수 테스트 — 커버리지 강화
// =============================================================================

// ---------------------------------------------------------------------------
// 춥다 (ㅂ 불규칙, stem: "춥", altStem: "추우")
// ---------------------------------------------------------------------------
type _춥_해요 = Expect<Equal<Conjugate<춥다, "해요체">, "추워요">>;
type _춥_과거 = Expect<Equal<Conjugate<춥다, "과거_평서">, "추웠다">>;
type _춥_합쇼 = Expect<Equal<Conjugate<춥다, "합쇼체">, "춥습니다">>;
type _춥_평서 = Expect<Equal<Conjugate<춥다, "평서_현재">, "춥다">>;
type _춥_고 = Expect<Equal<Conjugate<춥다, "고">, "춥고">>;
type _춥_아서 = Expect<Equal<Conjugate<춥다, "아서">, "추워서">>;
type _춥_면 = Expect<Equal<Conjugate<춥다, "면">, "추우면">>;
type _춥_지만 = Expect<Equal<Conjugate<춥다, "지만">, "춥지만">>;

// ---------------------------------------------------------------------------
// 아름답다 (ㅂ 불규칙, stem: "아름답", altStem: "아름다우")
// ---------------------------------------------------------------------------
type _아름답_해요 = Expect<Equal<Conjugate<아름답다, "해요체">, "아름다워요">>;
type _아름답_과거 = Expect<
  Equal<Conjugate<아름답다, "과거_평서">, "아름다웠다">
>;
type _아름답_합쇼 = Expect<
  Equal<Conjugate<아름답다, "합쇼체">, "아름답습니다">
>;
type _아름답_평서 = Expect<Equal<Conjugate<아름답다, "평서_현재">, "아름답다">>;
type _아름답_고 = Expect<Equal<Conjugate<아름답다, "고">, "아름답고">>;
type _아름답_아서 = Expect<Equal<Conjugate<아름답다, "아서">, "아름다워서">>;
type _아름답_면 = Expect<Equal<Conjugate<아름답다, "면">, "아름다우면">>;
type _아름답_지만 = Expect<Equal<Conjugate<아름답다, "지만">, "아름답지만">>;

// ---------------------------------------------------------------------------
// 걷다 (ㄷ 불규칙, stem: "걷", altStem: "걸")
// ---------------------------------------------------------------------------
type _걷_해요 = Expect<Equal<Conjugate<걷다, "해요체">, "걸어요">>;
type _걷_과거 = Expect<Equal<Conjugate<걷다, "과거_평서">, "걸었다">>;
type _걷_합쇼 = Expect<Equal<Conjugate<걷다, "합쇼체">, "걷습니다">>;
type _걷_평서 = Expect<Equal<Conjugate<걷다, "평서_현재">, "걷는다">>;
type _걷_고 = Expect<Equal<Conjugate<걷다, "고">, "걷고">>;
type _걷_아서 = Expect<Equal<Conjugate<걷다, "아서">, "걸어서">>;
type _걷_면 = Expect<Equal<Conjugate<걷다, "면">, "걸으면">>;
type _걷_지만 = Expect<Equal<Conjugate<걷다, "지만">, "걷지만">>;

// ---------------------------------------------------------------------------
// 낫다 (ㅅ 불규칙, stem: "낫", altStem: "나")
// ---------------------------------------------------------------------------
type _낫_해요 = Expect<Equal<Conjugate<낫다, "해요체">, "나아요">>;
type _낫_과거 = Expect<Equal<Conjugate<낫다, "과거_평서">, "나았다">>;
type _낫_합쇼 = Expect<Equal<Conjugate<낫다, "합쇼체">, "낫습니다">>;
type _낫_평서 = Expect<Equal<Conjugate<낫다, "평서_현재">, "낫는다">>;
type _낫_고 = Expect<Equal<Conjugate<낫다, "고">, "낫고">>;
type _낫_아서 = Expect<Equal<Conjugate<낫다, "아서">, "나아서">>;
type _낫_면 = Expect<Equal<Conjugate<낫다, "면">, "나으면">>;
type _낫_지만 = Expect<Equal<Conjugate<낫다, "지만">, "낫지만">>;

// ---------------------------------------------------------------------------
// 빠르다 (르 불규칙, stem: "빠르", altStem: "빨")
// ---------------------------------------------------------------------------
type _빠르_해요 = Expect<Equal<Conjugate<빠르다, "해요체">, "빨라요">>;
type _빠르_과거 = Expect<Equal<Conjugate<빠르다, "과거_평서">, "빨랐다">>;
type _빠르_합쇼 = Expect<Equal<Conjugate<빠르다, "합쇼체">, "빠릅니다">>;
type _빠르_고 = Expect<Equal<Conjugate<빠르다, "고">, "빠르고">>;
type _빠르_아서 = Expect<Equal<Conjugate<빠르다, "아서">, "빨라서">>;
type _빠르_면 = Expect<Equal<Conjugate<빠르다, "면">, "빠르면">>;
type _빠르_지만 = Expect<Equal<Conjugate<빠르다, "지만">, "빠르지만">>;

// ---------------------------------------------------------------------------
// 어떻다 (ㅎ 불규칙, stem: "어떻", altStem: "어때")
// ---------------------------------------------------------------------------
type _어떻_해요 = Expect<Equal<Conjugate<어떻다, "해요체">, "어때요">>;
type _어떻_과거 = Expect<Equal<Conjugate<어떻다, "과거_평서">, "어땠다">>;
type _어떻_합쇼 = Expect<Equal<Conjugate<어떻다, "합쇼체">, "어떻습니다">>;
type _어떻_평서 = Expect<Equal<Conjugate<어떻다, "평서_현재">, "어떻다">>;
type _어떻_고 = Expect<Equal<Conjugate<어떻다, "고">, "어떻고">>;
type _어떻_아서 = Expect<Equal<Conjugate<어떻다, "아서">, "어때서">>;
type _어떻_면 = Expect<Equal<Conjugate<어떻다, "면">, "어떠면">>;
type _어떻_지만 = Expect<Equal<Conjugate<어떻다, "지만">, "어떻지만">>;

// ---------------------------------------------------------------------------
// 운동하다 (하다 동사, prefix: "운동")
// ---------------------------------------------------------------------------
type _운동_해요 = Expect<Equal<Conjugate<운동하다, "해요체">, "운동해요">>;
type _운동_과거 = Expect<Equal<Conjugate<운동하다, "과거_평서">, "운동했다">>;
type _운동_합쇼 = Expect<Equal<Conjugate<운동하다, "합쇼체">, "운동합니다">>;
type _운동_평서 = Expect<Equal<Conjugate<운동하다, "평서_현재">, "운동한다">>;
type _운동_고 = Expect<Equal<Conjugate<운동하다, "고">, "운동하고">>;
type _운동_아서 = Expect<Equal<Conjugate<운동하다, "아서">, "운동해서">>;
type _운동_면 = Expect<Equal<Conjugate<운동하다, "면">, "운동하면">>;
type _운동_지만 = Expect<Equal<Conjugate<운동하다, "지만">, "운동하지만">>;

// ---------------------------------------------------------------------------
// 가깝다 (ㅂ 불규칙, stem: "가깝", altStem: "가까우")
// ---------------------------------------------------------------------------
type _가깝_해요 = Expect<Equal<Conjugate<가깝다, "해요체">, "가까워요">>;
type _가깝_과거 = Expect<Equal<Conjugate<가깝다, "과거_평서">, "가까웠다">>;
type _가깝_합쇼 = Expect<Equal<Conjugate<가깝다, "합쇼체">, "가깝습니다">>;
type _가깝_고 = Expect<Equal<Conjugate<가깝다, "고">, "가깝고">>;
type _가깝_아서 = Expect<Equal<Conjugate<가깝다, "아서">, "가까워서">>;
type _가깝_면 = Expect<Equal<Conjugate<가깝다, "면">, "가까우면">>;
type _가깝_지만 = Expect<Equal<Conjugate<가깝다, "지만">, "가깝지만">>;

// ---------------------------------------------------------------------------
// 덥다 (ㅂ 불규칙, stem: "덥", altStem: "더우")
// ---------------------------------------------------------------------------
type _덥_해요 = Expect<Equal<Conjugate<덥다, "해요체">, "더워요">>;
type _덥_과거 = Expect<Equal<Conjugate<덥다, "과거_평서">, "더웠다">>;
type _덥_합쇼 = Expect<Equal<Conjugate<덥다, "합쇼체">, "덥습니다">>;
type _덥_평서 = Expect<Equal<Conjugate<덥다, "평서_현재">, "덥다">>;
type _덥_고 = Expect<Equal<Conjugate<덥다, "고">, "덥고">>;
type _덥_아서 = Expect<Equal<Conjugate<덥다, "아서">, "더워서">>;
type _덥_면 = Expect<Equal<Conjugate<덥다, "면">, "더우면">>;
type _덥_지만 = Expect<Equal<Conjugate<덥다, "지만">, "덥지만">>;

// ---------------------------------------------------------------------------
// 듣다 (ㄷ 불규칙, stem: "듣", altStem: "들")
// ---------------------------------------------------------------------------
type _듣_해요 = Expect<Equal<Conjugate<듣다, "해요체">, "들어요">>;
type _듣_과거 = Expect<Equal<Conjugate<듣다, "과거_평서">, "들었다">>;
type _듣_고 = Expect<Equal<Conjugate<듣다, "고">, "듣고">>;
type _듣_합쇼 = Expect<Equal<Conjugate<듣다, "합쇼체">, "듣습니다">>;
type _듣_평서 = Expect<Equal<Conjugate<듣다, "평서_현재">, "듣는다">>;
type _듣_아서 = Expect<Equal<Conjugate<듣다, "아서">, "들어서">>;
type _듣_면 = Expect<Equal<Conjugate<듣다, "면">, "들으면">>;
type _듣_지만 = Expect<Equal<Conjugate<듣다, "지만">, "듣지만">>;

// ---------------------------------------------------------------------------
// 짓다 (ㅅ 불규칙, stem: "짓", altStem: "지")
// ---------------------------------------------------------------------------
type _짓_해요 = Expect<Equal<Conjugate<짓다, "해요체">, "지어요">>;
type _짓_과거 = Expect<Equal<Conjugate<짓다, "과거_평서">, "지었다">>;
type _짓_고 = Expect<Equal<Conjugate<짓다, "고">, "짓고">>;
type _짓_합쇼 = Expect<Equal<Conjugate<짓다, "합쇼체">, "짓습니다">>;
type _짓_평서 = Expect<Equal<Conjugate<짓다, "평서_현재">, "짓는다">>;
type _짓_아서 = Expect<Equal<Conjugate<짓다, "아서">, "지어서">>;
type _짓_면 = Expect<Equal<Conjugate<짓다, "면">, "지으면">>;
type _짓_지만 = Expect<Equal<Conjugate<짓다, "지만">, "짓지만">>;

// ---------------------------------------------------------------------------
// 모르다 (르 불규칙, stem: "모르", altStem: "몰")
// ---------------------------------------------------------------------------
type _모르_해요 = Expect<Equal<Conjugate<모르다, "해요체">, "몰라요">>;
type _모르_과거 = Expect<Equal<Conjugate<모르다, "과거_평서">, "몰랐다">>;
type _모르_고 = Expect<Equal<Conjugate<모르다, "고">, "모르고">>;
type _모르_합쇼 = Expect<Equal<Conjugate<모르다, "합쇼체">, "모릅니다">>;
type _모르_아서 = Expect<Equal<Conjugate<모르다, "아서">, "몰라서">>;
type _모르_면 = Expect<Equal<Conjugate<모르다, "면">, "모르면">>;
type _모르_지만 = Expect<Equal<Conjugate<모르다, "지만">, "모르지만">>;

// ---------------------------------------------------------------------------
// 그렇다 (ㅎ 불규칙, stem: "그렇", altStem: "그래")
// ---------------------------------------------------------------------------
type _그렇_해요 = Expect<Equal<Conjugate<그렇다, "해요체">, "그래요">>;
type _그렇_과거 = Expect<Equal<Conjugate<그렇다, "과거_평서">, "그랬다">>;
type _그렇_고 = Expect<Equal<Conjugate<그렇다, "고">, "그렇고">>;
type _그렇_합쇼 = Expect<Equal<Conjugate<그렇다, "합쇼체">, "그렇습니다">>;
type _그렇_평서 = Expect<Equal<Conjugate<그렇다, "평서_현재">, "그렇다">>;
type _그렇_아서 = Expect<Equal<Conjugate<그렇다, "아서">, "그래서">>;
type _그렇_면 = Expect<Equal<Conjugate<그렇다, "면">, "그러면">>;
type _그렇_지만 = Expect<Equal<Conjugate<그렇다, "지만">, "그렇지만">>;

// ---------------------------------------------------------------------------
// 읽다 전수 테스트 (기존 테스트 0건)
// ---------------------------------------------------------------------------
type _읽_해요 = Expect<Equal<Conjugate<읽다, "해요체">, "읽어요">>;
type _읽_과거 = Expect<Equal<Conjugate<읽다, "과거_평서">, "읽었다">>;
type _읽_합쇼 = Expect<Equal<Conjugate<읽다, "합쇼체">, "읽습니다">>;
type _읽_평서 = Expect<Equal<Conjugate<읽다, "평서_현재">, "읽는다">>;
type _읽_고 = Expect<Equal<Conjugate<읽다, "고">, "읽고">>;
type _읽_아서 = Expect<Equal<Conjugate<읽다, "아서">, "읽어서">>;
type _읽_면 = Expect<Equal<Conjugate<읽다, "면">, "읽으면">>;
type _읽_지만 = Expect<Equal<Conjugate<읽다, "지만">, "읽지만">>;

// ---------------------------------------------------------------------------
// 잡다 전수 테스트 (기존 테스트 0건)
// ---------------------------------------------------------------------------
type _잡_해요 = Expect<Equal<Conjugate<잡다, "해요체">, "잡아요">>;
type _잡_과거 = Expect<Equal<Conjugate<잡다, "과거_평서">, "잡았다">>;
type _잡_합쇼 = Expect<Equal<Conjugate<잡다, "합쇼체">, "잡습니다">>;
type _잡_평서 = Expect<Equal<Conjugate<잡다, "평서_현재">, "잡는다">>;
type _잡_고 = Expect<Equal<Conjugate<잡다, "고">, "잡고">>;
type _잡_아서 = Expect<Equal<Conjugate<잡다, "아서">, "잡아서">>;
type _잡_면 = Expect<Equal<Conjugate<잡다, "면">, "잡으면">>;
type _잡_지만 = Expect<Equal<Conjugate<잡다, "지만">, "잡지만">>;

// ---------------------------------------------------------------------------
// 보다, 오다, 주다, 쓰다, 마시다 — 기존에 빠진 활용형 보강
// ---------------------------------------------------------------------------

// 보다
type _보_해요 = Expect<Equal<Conjugate<보다, "해요체">, "봐요">>;
type _보_과거 = Expect<Equal<Conjugate<보다, "과거_평서">, "봤다">>;
type _보_합쇼 = Expect<Equal<Conjugate<보다, "합쇼체">, "봅니다">>;
type _보_고 = Expect<Equal<Conjugate<보다, "고">, "보고">>;
type _보_면 = Expect<Equal<Conjugate<보다, "면">, "보면">>;

// 오다
type _오_해요 = Expect<Equal<Conjugate<오다, "해요체">, "와요">>;
type _오_과거 = Expect<Equal<Conjugate<오다, "과거_평서">, "왔다">>;
type _오_합쇼 = Expect<Equal<Conjugate<오다, "합쇼체">, "옵니다">>;
type _오_고 = Expect<Equal<Conjugate<오다, "고">, "오고">>;
type _오_면 = Expect<Equal<Conjugate<오다, "면">, "오면">>;

// 주다
type _주_해요 = Expect<Equal<Conjugate<주다, "해요체">, "줘요">>;
type _주_과거 = Expect<Equal<Conjugate<주다, "과거_평서">, "줬다">>;
type _주_합쇼 = Expect<Equal<Conjugate<주다, "합쇼체">, "줍니다">>;
type _주_고 = Expect<Equal<Conjugate<주다, "고">, "주고">>;

// 쓰다
type _쓰_해요 = Expect<Equal<Conjugate<쓰다, "해요체">, "써요">>;
type _쓰_과거 = Expect<Equal<Conjugate<쓰다, "과거_평서">, "썼다">>;
type _쓰_합쇼 = Expect<Equal<Conjugate<쓰다, "합쇼체">, "씁니다">>;
type _쓰_고 = Expect<Equal<Conjugate<쓰다, "고">, "쓰고">>;

// 마시다
type _마시_해요 = Expect<Equal<Conjugate<마시다, "해요체">, "마셔요">>;
type _마시_과거 = Expect<Equal<Conjugate<마시다, "과거_평서">, "마셨다">>;
type _마시_합쇼 = Expect<Equal<Conjugate<마시다, "합쇼체">, "마십니다">>;
type _마시_고 = Expect<Equal<Conjugate<마시다, "고">, "마시고">>;
