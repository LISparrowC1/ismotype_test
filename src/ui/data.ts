import type { Ism, MbtiType, Question } from '../core/content'
import type { Norms } from '../core/norms'
import type { Taxonomy } from '../core/taxonomy'
import taxonomyJson from '../data/taxonomy/v1.json'
import ideologyJson from '../data/questions/ideology.v1.json'
import ipipJson from '../data/questions/bigfive.ipip50.json'
import mbtiJson from '../data/questions/mbti.16p.v1.json'
import ismsJson from '../data/isms/profiles.v1.json'
import normsJson from '../data/norms/ipip50.v1.json'
import mbtiTypesJson from '../data/mbti/types.v1.json'

/**
 * 类型卡要用的色值。core 的 `MbtiType` 只有结构（`code` / `nameKey` / `descKey`），
 * 颜色是**数据**，只存在于 `src/data/mbti/types.v1.json`，故在这里扩展。
 */
export interface MbtiTypeStyle extends MbtiType {
  colorFamily: string
  colorStep: string
  /** 该型的品牌色，**只作为实色块与顶栏**使用，绝不做文字颜色 */
  colorHex: string
}

export interface AppDataset {
  taxonomy: Taxonomy
  /** 主义层 248 题 */
  questions: Question[]
  isms: Ism[]
  /** IPIP-50 + 16personalities 60，共 110 题 */
  personalityQuestions: Question[]
  norms: Norms
}

/**
 * 内容直接进包，**不做运行时校验**。
 *
 * 理由：数据在进仓库之前已经过结构校验与内容闸门，坏数据发不出去；
 * 把校验器和它的中文错误文案打进浏览器包没有收益。类型断言是安全的 —— JSON 的形状
 * 由那道校验保证，这里只是让 TS 拿到类型。
 *
 * **题库文件名必须与 `src/data/personality.ts` 的 `PERSONALITY_PATHS.mbti` 一致。**
 * 这里曾引 `mbti.v1.json`（上一代自建的四维 48 题版），而 core 早已换成
 * `mbti.16p.v1.json`（五维 60 题）—— 于是界面上五维叫不出名字、60 道题里有 12 道
 * 按错误的维度计分，而类型检查与打包全绿。改这里之后，务必对着界面确认五维的名称与题量。
 *
 * **这里不能 import `src/data/index.ts`**：那是 Node 加载器，会把 `node:fs` 拖进浏览器包。
 * 该边界由 `eslint.config.js` 的 `node:*` 规则强制。
 */
export const dataset: AppDataset = {
  taxonomy: taxonomyJson as Taxonomy,
  questions: ideologyJson as Question[],
  isms: ismsJson as Ism[],
  personalityQuestions: [...(ipipJson as Question[]), ...(mbtiJson as Question[])],
  norms: normsJson as Norms,
}

/** 16 型的色卡与文案键。 */
export const mbtiTypes: readonly MbtiTypeStyle[] = mbtiTypesJson as MbtiTypeStyle[]

const mbtiTypeByCode = new Map(mbtiTypes.map((t) => [t.code, t]))

/** 类型码 → 色卡。未知码返回 undefined，由调用方决定怎么退化。 */
export function mbtiTypeOf(code: string): MbtiTypeStyle | undefined {
  return mbtiTypeByCode.get(code)
}

/**
 * 两层的全部题目。`buildResult` 需要它在同一个数组里（作答要能按 id 找到题目），
 * 进度分母也用它。
 */
export const allQuestions: Question[] = [...dataset.questions, ...dataset.personalityQuestions]

/** 题 id → 题目。界面多处要按 id 取题（作答映射的键就是 id）。 */
export const questionById: ReadonlyMap<string, Question> = new Map(
  allQuestions.map((q) => [q.id, q]),
)

const ismById = new Map(dataset.isms.map((ism) => [ism.id, ism]))

/** 主义 id → 该主义的名称键（结果页要按 id 显示名字）。 */
export function ismNameKey(ismId: string): string {
  return ismById.get(ismId)?.nameKey ?? ismId
}

export function ismDescKey(ismId: string): string {
  return ismById.get(ismId)?.descKey ?? ismId
}
